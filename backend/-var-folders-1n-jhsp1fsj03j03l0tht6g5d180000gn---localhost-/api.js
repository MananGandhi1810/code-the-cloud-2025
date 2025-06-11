export const apiEndpoints = [
  {
    "id": "cmbrulsay000ktz0r8ho8foo3",
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
    "projectId": "cmbrulmbk000jtz0r7v5p9kjb"
  },
  {
    "id": "cmbrulsay000ltz0rxgyexb0w",
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
    "projectId": "cmbrulmbk000jtz0r7v5p9kjb"
  },
  {
    "id": "cmbrulsay000mtz0r6sm5sh74",
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
    "projectId": "cmbrulmbk000jtz0r7v5p9kjb"
  },
  {
    "id": "cmbrulsay000ntz0r2fl9cnpw",
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
    "projectId": "cmbrulmbk000jtz0r7v5p9kjb"
  },
  {
    "id": "cmbrulsay000otz0rd2pbb0vo",
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
    "projectId": "cmbrulmbk000jtz0r7v5p9kjb"
  },
  {
    "id": "cmbrulsay000ptz0r9wo5h8w1",
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
    "projectId": "cmbrulmbk000jtz0r7v5p9kjb"
  }
];