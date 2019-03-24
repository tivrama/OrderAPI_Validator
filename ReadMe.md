# OrderAPI_Validator

## API

To check your payloads, post them in the body as raw application/JSON.  In the url, add your retailer moniker, and a comma seperated list of the products you are validating.  Order API payloads can be validated with the following products: alert, return, monitor.  Other poducts only accept one product.  Ship API, for example, Ship API, will only accept "ship", and Label API will only accept "label".

List of all accepable parameters:
- ship
- return
- alert
- monitor
- track
- bopis
- notificationpref_customer_post
- notificationpref_customer_put
- notificationpref_order_post
- notificationpref_order_put
- label

1) Post:
- url: ```https://api-validator.herokuapp.com/api/validator?retailer=<retailer>&product=<comma seperated list of products>```
- Example: ```https://api-validator.herokuapp.com/api/validator?retailer=peninsula&product=alert,return``` Note: some products take a different payload, like ship and label. 
- body: Payload for the product - *only send one at a time*
- response body: Subdivided payload by product

*Note: Get functionality, and all saving to the DB has been removed until further notice. *
To get your payload back, (for example, to see what your OMS is posting), pass your retailer moniker, and order number.  For Order API posts, use the order number.  For all other products, pass "1".
2) Get:
- url (for non-order api, make "1" the order): ```https://api-validator.herokuapp.com/api/retriever?retailer=<retailer>&order=<order>```
- Example: ```https://api-validator.herokuapp.com/api/retriever?retailer=peninsula&order=123456789```
- response body: The exact json payload from the Post

### List of Products
List of all accepable parameters:
- ship
- return
- alert
- monitor
- track
- bopis
- notificationpref_customer_post
- notificationpref_customer_put
- notificationpref_order_post
- notificationpref_order_put
- label

## Schema for Post Response

### Valid Order API JSON
```
{
    "order_number": "Pass",
    "order_date": "Pass",
    "order_items": [
        {
            "item_id": "Pass",
            "sku": "Pass",
            "name": "Pass",
            "description": "Pass",
            "quantity": "Pass",
            "unit_price": "Pass",
            "item_image": "Pass",
            "is_final_sale": "Pass",
            "is_gift": "Pass"
        }
    ],
    "shipments": [
        {
            "items_info": [
                {
                    "quantity": "Pass",
                    "sku": "Pass"
                }
            ],
            "carrier": "Pass",
            "shipped_to": {
                "first_name": "Pass",
                "last_name": "Pass",
                "phone": "Pass",
                "email": "Pass",
                "address": {
                    "street_1": "Pass",
                    "city": "Pass",
                    "state": "Pass",
                    "zip": "Pass",
                    "country": "Pass"
                }
            },
            "ship_date": "Pass",
            "tracking_number": "Pass"
        }
    ],
    "billing": {
        "first_name": "Pass",
        "last_name": "Pass",
        "email": "Pass",
        "address": {
            "street_1": "Pass",
            "city": "Pass",
            "state": "Pass",
            "zip": "Pass",
            "country": "Pass"
        }
    },
    "customer": {
        "customer_id": "Pass",
        "first_name": "Pass",
        "last_name": "Pass",
        "email": "Pass",
        "address": {
            "street_1": "Pass",
            "city": "Pass",
            "state": "Pass",
            "zip": "Pass",
            "country": "Pass"
        }
    },
    "match_shipments_with_items": {
        "99104349319": "Pass"
    }
}
```

### Malformed Schema or Missing/Malformed data
```
{
    "order_number": "Pass",
    "order_date": "Fail - invalid date",
    "order_items": [
        {
            "item_id": "Pass",
            "sku": "Pass",
            "name": "Pass",
            "description": "Pass",
            "quantity": "Pass",
            "unit_price": "Pass",
            "item_image": "Fail - not a valid image type",
            "is_final_sale": "Pass",
            "is_gift": "Pass"
        }
    ],
    "shipments": [
        {
            "items_info": [
                {
                    "quantity": "Pass",
                    "sku": "Pass"
                }
            ],
            "carrier": "Fail - Not a valid carrier moniker",
            "shipped_to": {
                "first_name": "Fail - invalid string",
                "last_name": "Fail - invalid string",
                "phone": "Fail - invalid string",
                "email": "Fail - invalid email",
                "address": {
                    "street_1": "Fail - invalid string",
                    "city": "Fail - invalid string",
                    "state": "Fail - invalid string",
                    "zip": "Fail - invalid string",
                    "country": "Fail - invalid string"
                }
            },
            "ship_date": "Fail - Not a valid date",
            "tracking_number": "Fail - invalid string"
        }
    ],
    "billing": {
        "first_name": "Fail - invalid string",
        "last_name": "Fail - invalid string",
        "email": "Fail - invalid email",
        "address": {
            "street_1": "Fail - invalid string",
            "city": "Fail - invalid string",
            "state": "Pass",
            "zip": "Pass",
            "country": "Pass"
        }
    },
    "customer": {
        "customer_id": "Pass",
        "first_name": "Pass",
        "last_name": "Pass",
        "email": "Fail - invalid email",
        "address": {
            "street_1": "Pass",
            "city": "Pass",
            "state": "Pass",
            "zip": "Pass",
            "country": "Pass"
        }
    },
    "match_shipments_with_items": {
        "99103060258": "Warning - there are still 1 of 99103060258 left unshipped."
    }
}
```

### Malformed JSON
```
<pre>Bad Request</pre>
```


## TODO:
- Add to this page: https://narvar.atlassian.net/wiki/spaces/WS/pages/135758693/Order+API+Specifications
- BOPIS
- Track
- Notify (Put and Get)
- Order API (Refine Shipment to Item Pairing in Order API for items which shipped too many times)
- Order API (Put)
- Warn unrecognized attributes in Order API
- Label
- Simple Returns
- Other Attibutes
  - SKU (required)
  - Checkout Locale
  - Fulfilment Status
  - 


!!!
 - Make SKU a required field
 - Add Checkout Locale
 - Add Checkout Brand
 - Add Notification Center API
 - Bopis
 - Track with Item Vis
