(function () {
  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  let PayU;

  (function (_PayU) {
    class PayUResponse {
      constructor() {
        _defineProperty(this, "transactionId", void 0);

        _defineProperty(this, "statusCode", void 0);

        _defineProperty(this, "statusDescription", void 0);

        _defineProperty(this, "url", void 0);

        _defineProperty(this, "email", void 0);

        _defineProperty(this, "errorCode", void 0);

        _defineProperty(this, "errorDescription", void 0);

        _defineProperty(this, "debugRequest", void 0);

        _defineProperty(this, "debugResponse", void 0);

        this.errorCode = "";
        this.statusCode = "";
      }

    }

    _PayU.PayUResponse = PayUResponse;

    function payuParseResp(response) {
      const preRegex = new RegExp('^<pre>(.*?)<\/pre>$', 'ims');
      var match = preRegex.exec(response);
      let resp = {};

      if (match && match.length == 2) {
        let text = match[1];

        if (!text.startsWith('Array')) {
          resp['ErrorCode'] = '101';
          resp['Error'] = text;
        } else {
          resp['ErrorCode'] = '0';
          text.split(/\n/g).forEach(function (line) {
            let mmm = /\[(.*?)\]\s+=>\s+(.*?)$/.exec(line);

            if (mmm && mmm.length == 3) {
              resp[mmm[1]] = mmm[2];
            }
          });
        }
      } else {
        resp['ErrorCode'] = '100';
        resp['Error'] = 'unknown answer';
      }

      return resp;
    }

    _PayU.payuParseResp = payuParseResp;

    class PayUWrapper {
      constructor(baseUrl, merchantId, salt) {
        _defineProperty(this, "_endpoint", void 0);

        _defineProperty(this, "_merchantId", void 0);

        _defineProperty(this, "_salt", void 0);

        this._endpoint = baseUrl;
        this._merchantId = merchantId;
        this._salt = salt;
      }

      createInvoice(request) {
        var jsonString = JSON.stringify(request);
        let hashString = `${this._merchantId}|create_invoice|${jsonString}|${this._salt}`;
        let hashRes = "";
        let requestBody = "";
        let urlEncodedDataPairs = [];
        urlEncodedDataPairs.push(encodeURIComponent("key") + '=' + encodeURIComponent(this._merchantId));
        urlEncodedDataPairs.push(encodeURIComponent("command") + '=' + encodeURIComponent("create_invoice"));
        urlEncodedDataPairs.push(encodeURIComponent("hash") + '=' + encodeURIComponent(hashRes));
        urlEncodedDataPairs.push(encodeURIComponent("var1") + '=' + encodeURIComponent(jsonString));
        requestBody = urlEncodedDataPairs.join('&').replace(/%20/g, '+');
        var _ep = this._endpoint;
        return new Promise((resolve, reject) => {
          var rr = new PayUResponse();
          rr.transactionId = request.txnid;
          rr.debugRequest = requestBody;
          rr.errorCode = "0";
          var xhr = new XMLHttpRequest();

          xhr.onreadystatechange = function () {
            try {
              if (xhr.readyState !== 4) return;
              if (xhr.status !== 200) throw new Error("Failed with status " + xhr.status + "; " + xhr.responseText);
              rr.debugResponse = xhr.responseText;
              const resp = payuParseResp(xhr.responseText);

              if (resp['Error']) {
                rr.errorCode = resp['ErrorCode'];
                rr.errorDescription = resp['Error'];
                rr.statusCode = '100';
              } else {
                rr.transactionId = resp['Transaction Id'];
                rr.url = resp['URL'];
                rr.email = resp['Email Id'];
              }

              resolve(rr);
            } catch (e) {
              rr.errorCode = "-1";
              rr.errorDescription = e.message;
              reject(rr);
            }
          };

          xhr.open("POST", _ep);
          xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
          xhr.send(requestBody);
        });
      }

    }

    _PayU.PayUWrapper = PayUWrapper;
  })(PayU || (PayU = {}));

  metadata = {
    systemName: "PayU API",
    displayName: "PayU API",
    description: "PayU integration API",
    "configuration": {
      "EndpointUrl": {
        displayName: "PayU endpoint Url",
        type: "string",
        value: "https://test.payu.in/merchant/postservice.php?form=1"
      },
      "MerchantId": {
        displayName: "PayU MerchantId",
        type: "string",
        value: "eekig4"
      },
      "SALT": {
        displayName: "PayU Merchant SALT",
        type: "string",
        value: "KsnWno3F"
      },
      "EMailTemplateId": {
        displayName: "PayU EMail Template Id",
        type: "string",
        value: "1449"
      },
      "SMSTemplateId": {
        displayName: "PayU SMS Template Id",
        type: "string",
        value: "1448"
      },
      "ValidationPeriod": {
        displayName: "PayU Validation Period",
        type: "string",
        value: "6"
      },
      "DoSendSMS": {
        displayName: "PayU Send SMS on create_invoice",
        type: "string",
        value: "1"
      },
      "DoSendEmail": {
        displayName: "PayU Send Email on create_invoice",
        type: "string",
        value: "1"
      }
    }
  };

  ondescribe = async function ({
    configuration
  }) {
    postSchema({
      objects: {
        "PayU": {
          displayName: "PayU payment API",
          description: "PayU payment API",
          properties: {
            "transactionId": {
              displayName: "transactionId",
              type: "string"
            },
            "statusCode": {
              displayName: "statusCode",
              type: "string"
            },
            "statusDescription": {
              displayName: "statusDescription",
              type: "string"
            },
            "errorCode": {
              displayName: "errorCode",
              type: "string"
            },
            "errorDescription": {
              displayName: "errorDescription",
              type: "string"
            },
            "debugRequest": {
              displayName: "debugRequest",
              type: "string"
            },
            "debugResponse": {
              displayName: "debugResponse",
              type: "string"
            },
            "url": {
              displayName: "payment url",
              type: "string"
            },
            "email": {
              displayName: "customer email",
              type: "string"
            },
            "version": {
              displayName: "version",
              type: "string"
            },
            "timeout": {
              displayName: "timeout (minutes)",
              type: "number"
            }
          },
          methods: {
            "CreateInvoice": {
              displayName: "Create Invoice",
              type: "execute",
              parameters: {
                "pTransactionId": {
                  displayName: "pTransactionId",
                  description: "Transaction Id",
                  type: "string"
                },
                "pProductInfo": {
                  displayName: "pProductInfo",
                  description: "This parameter should contain a brief product description. It should be a string describing the product",
                  type: "string"
                },
                "pAmount": {
                  displayName: "pAmount",
                  description: "Transaction amount",
                  type: "string"
                },
                "pFirstName": {
                  displayName: "pFirstName",
                  description: "first name of the customer",
                  type: "string"
                },
                "pLastName": {
                  displayName: "pLastName",
                  description: "last name of the customer",
                  type: "string"
                },
                "pEmail": {
                  displayName: "pEmail",
                  description: "email of the customer",
                  type: "string"
                },
                "pPhone": {
                  displayName: "pPhone",
                  description: "The phone number of the customer",
                  type: "string"
                },
                "pAddress1": {
                  displayName: "pAddress1",
                  description: "Address line #1",
                  type: "string"
                },
                "pCity": {
                  displayName: "pCity",
                  description: "City",
                  type: "string"
                },
                "pState": {
                  displayName: "pState",
                  description: "State",
                  type: "string"
                },
                "pCountry": {
                  displayName: "pCountry",
                  description: "Country",
                  type: "string"
                },
                "pZip": {
                  displayName: "pZip",
                  description: "ZIP Code",
                  type: "string"
                }
              },
              requiredParameters: ["pTransactionId", "pProductInfo", "pAmount", "pFirstName", "pEmail", "pAddress1", "pCity", "pState", "pCountry", "pZip"],
              outputs: ["transactionId", "statusCode", "statusDescription", "errorCode", "errorDescription", "debugRequest", "debugResponse", "url", "email"]
            },
            "GetTransactionId": {
              displayName: "Generate new transactionId",
              type: "read",
              parameters: {
                "pLeadNumber": {
                  displayName: "pLeadNumber",
                  description: "Lead Number",
                  type: "string"
                },
                "pProductType": {
                  displayName: "pProductType",
                  description: "Type of product",
                  type: "string"
                }
              },
              requiredParameters: ["pLeadNumber", "pProductType"],
              outputs: ["transactionId"]
            },
            "GetVersion": {
              displayName: "Get gateway version",
              type: "read",
              outputs: ["version"]
            }
          }
        }
      }
    });
  };

  onexecute = async function ({
    objectName,
    methodName,
    parameters,
    properties,
    configuration,
    schema
  }) {
    try {
      switch (objectName) {
        case "PayU":
          await onexecutePayU(methodName, properties, parameters, configuration);
          break;

        default:
          throw new Error("The object " + objectName + " is not supported.");
      }
    } catch (e) {
      postResult({
        "statusCode": "Exception",
        "statusDescription": e.message,
        "errorCode": "Exception",
        "errorDescription": e.stack
      });
    }
  };

  async function onexecutePayU(methodName, properties, parameters, configuration) {
    switch (methodName) {
      case "CreateInvoice":
        await payuCreateInvoice(parameters, configuration);
        break;

      case "GetTransactionId":
        await payuGetTransactionId(parameters);
        break;

      case "GetVersion":
        await payuGetVersion();
        break;

      default:
        throw new Error("The method " + methodName + " is not supported.");
    }
  }

  function payuCreateInvoice(parameters, configuration) {
    var endpoint = configuration["EndpointUrl"];
    var merchantId = configuration["MerchantId"];
    var salt = configuration["SALT"];
    let request = {
      "amount": parameters["pAmount"],
      "txnid": parameters["pTransactionId"],
      "productinfo": parameters["pProductInfo"],
      "firstname": parameters["pFirstName"],
      "lastname": parameters["pLastName"],
      "email": parameters["pEmail"],
      "phone": parameters["pPhone"],
      "address1": parameters["pAddress1"],
      "city": parameters["pCity"],
      "state": parameters["pState"],
      "country": parameters["pCountry"],
      "zipcode": parameters["pZip"],
      "template_id": configuration["EMailTemplateId"],
      "sms_template_id": configuration["SMSTemplateId"],
      "validation_period": configuration["ValidationPeriod"],
      "send_email_now": configuration["DoSendEmail"],
      "send_sms": configuration["DoSendSMS"]
    };
    return new Promise((resolve, reject) => {
      var wrap = new PayU.PayUWrapper(endpoint, merchantId, salt);
      wrap.createInvoice(request).then(response => {
        console.log(response);
        postResult(toK2Result(response));
        resolve();
      }).catch(err => {
        console.log(err);
        postResult(toK2Result(err));
        reject(err);
      });
    });
  }

  function payuGetVersion(parameters, configuration) {
    return new Promise((resolve, reject) => {
      postResult({
        "version": "202011220021"
      });
    });
  }

  function payuGetTransactionId(parameters, configuration) {
    return new Promise((resolve, reject) => {
      var leadNumber = parameters["pLeadNumber"].toString();
      var productType = parameters["pProductType"].toString();
      leadNumber = leadNumber.substr(0, 9).padStart(9, "0");
      productType = productType.substr(0, 4).padStart(4, "0");
      var uniqueValue = makeUniqId(20 - 9 - 4);
      if (parameters["pLeadNumber"].toString() == "test123") uniqueValue = "123456789";
      var result = `${leadNumber}${productType}${uniqueValue}`;
      result = result.split('&').join('_');
      result = result.split(' ').join('_');
      postResult({
        "transactionId": result
      });
      resolve();
    });
  }

  function makeUniqId(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;

    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

  function toK2Result(response) {
    return {
      "transactionId": response.transactionId,
      "statusCode": response.statusCode,
      "statusDescription": response.statusDescription,
      "url": response.url,
      "email": response.email,
      "errorCode": response.errorCode,
      "errorDescription": response.errorDescription,
      "debugRequest": response.debugRequest,
      "debugResponse": response.debugResponse
    };
  }

}());
//# sourceMappingURL=index.js.map
