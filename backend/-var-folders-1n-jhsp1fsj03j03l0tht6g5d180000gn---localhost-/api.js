export const apiEndpoints = [
  {
    "id": "cmbrtylo10002tz0r0gt9ocdq",
    "name": "/auth/login",
    "method": "POST",
    "bodyParams": [
      {
        "name": "email",
        "type": "string",
        "required": true
      },
      {
        "name": "password",
        "type": "string",
        "required": true
      }
    ],
    "queryParams": [],
    "expectedStatusCode": 200,
    "returnSchema": {
      "data": {
        "type": "object",
        "properties": {
          "user": {
            "type": "object",
            "properties": {
              "id": {
                "type": "string"
              },
              "name": {
                "type": "string"
              },
              "email": {
                "type": "string"
              },
              "points": {
                "type": "number"
              }
            }
          },
          "token": {
            "type": "string"
          }
        }
      },
      "message": {
        "type": "string"
      },
      "success": {
        "type": "boolean"
      }
    },
    "projectId": "cmbrtyfio0001tz0radghlnza"
  },
  {
    "id": "cmbrtylo10003tz0rv8elfd7x",
    "name": "/auth/register",
    "method": "POST",
    "bodyParams": [
      {
        "name": "name",
        "type": "string",
        "required": true
      },
      {
        "name": "email",
        "type": "string",
        "required": true
      },
      {
        "name": "password",
        "type": "string",
        "required": true
      }
    ],
    "queryParams": [],
    "expectedStatusCode": 200,
    "returnSchema": {
      "message": {
        "type": "string"
      },
      "success": {
        "type": "boolean"
      }
    },
    "projectId": "cmbrtyfio0001tz0radghlnza"
  },
  {
    "id": "cmbrtylo20004tz0rsoa6gkdz",
    "name": "/auth/user",
    "method": "GET",
    "bodyParams": [],
    "queryParams": [],
    "expectedStatusCode": 200,
    "returnSchema": {
      "data": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "email": {
            "type": "string"
          }
        }
      },
      "success": {
        "type": "boolean"
      }
    },
    "projectId": "cmbrtyfio0001tz0radghlnza"
  },
  {
    "id": "cmbrtylo20005tz0rkbjsljf5",
    "name": "/auth/forgot-password",
    "method": "POST",
    "bodyParams": [
      {
        "name": "email",
        "type": "string",
        "required": true
      }
    ],
    "queryParams": [],
    "expectedStatusCode": 200,
    "returnSchema": {
      "message": {
        "type": "string"
      },
      "success": {
        "type": "boolean"
      }
    },
    "projectId": "cmbrtyfio0001tz0radghlnza"
  },
  {
    "id": "cmbrtylo20006tz0rukg484ms",
    "name": "/auth/verify-otp",
    "method": "POST",
    "bodyParams": [
      {
        "name": "email",
        "type": "string",
        "required": true
      },
      {
        "name": "otp",
        "type": "string",
        "required": true
      }
    ],
    "queryParams": [],
    "expectedStatusCode": 200,
    "returnSchema": {
      "data": {
        "type": "object",
        "properties": {
          "token": {
            "type": "string"
          }
        }
      },
      "message": {
        "type": "string"
      },
      "success": {
        "type": "boolean"
      }
    },
    "projectId": "cmbrtyfio0001tz0radghlnza"
  },
  {
    "id": "cmbrtylo20007tz0rb8fjz61m",
    "name": "/auth/reset-password",
    "method": "POST",
    "bodyParams": [
      {
        "name": "email",
        "type": "string",
        "required": true
      },
      {
        "name": "password",
        "type": "string",
        "required": true
      }
    ],
    "queryParams": [],
    "expectedStatusCode": 200,
    "returnSchema": {
      "message": {
        "type": "string"
      },
      "success": {
        "type": "boolean"
      }
    },
    "projectId": "cmbrtyfio0001tz0radghlnza"
  }
];