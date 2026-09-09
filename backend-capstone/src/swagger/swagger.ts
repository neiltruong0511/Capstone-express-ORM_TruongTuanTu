import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const swaggerDocument = {
  openapi: "3.0.0",

  info: {
    title: "Pinterest API",
    version: "1.0.0",
    description: "Capstone Express ORM API",
  },

  servers: [
    {
      url: "http://localhost:3000",
    },
  ],

  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },

  paths: {
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Đăng ký tài khoản",

        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "mat_khau", "ho_ten"],
                properties: {
                  email: {
                    type: "string",
                    example: "user@gmail.com",
                  },
                  mat_khau: {
                    type: "string",
                    example: "123456",
                  },
                  ho_ten: {
                    type: "string",
                    example: "Nguyen Van A",
                  },
                  tuoi: {
                    type: "integer",
                    example: 22,
                  },
                },
              },
            },
          },
        },

        responses: {
          "201": {
            description: "Đăng ký thành công",
          },
          "400": {
            description: "Dữ liệu không hợp lệ",
          },
        },
      },
    },

    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Đăng nhập",

        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "mat_khau"],
                properties: {
                  email: {
                    type: "string",
                    example: "user@gmail.com",
                  },
                  mat_khau: {
                    type: "string",
                    example: "123456",
                  },
                },
              },
            },
          },
        },

        responses: {
          "200": {
            description: "Đăng nhập thành công",
          },
          "401": {
            description: "Sai email hoặc mật khẩu",
          },
        },
      },
    },

    "/api/images": {
      get: {
        tags: ["Images"],
        summary: "Lấy tất cả hình ảnh",

        responses: {
          "200": {
            description: "Lấy danh sách hình ảnh thành công",
          },
        },
      },

      post: {
        tags: ["Images"],
        summary: "Upload hình ảnh",
        security: [
          {
            bearerAuth: [],
          },
        ],

        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  image: {
                    type: "string",
                    format: "binary",
                  },
                  ten_hinh: {
                    type: "string",
                  },
                  mo_ta: {
                    type: "string",
                  },
                },
              },
            },
          },
        },

        responses: {
          "201": {
            description: "Upload thành công",
          },
          "401": {
            description: "Chưa đăng nhập",
          },
        },
      },
    },

    "/api/images/search": {
      get: {
        tags: ["Images"],
        summary: "Tìm kiếm hình ảnh",

        parameters: [
          {
            name: "keyword",
            in: "query",
            required: true,
            schema: {
              type: "string",
            },
            example: "cat",
          },
        ],

        responses: {
          "200": {
            description: "Tìm kiếm thành công",
          },
        },
      },
    },

    "/api/images/{id}": {
      get: {
        tags: ["Images"],
        summary: "Lấy chi tiết hình ảnh",

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],

        responses: {
          "200": {
            description: "Lấy chi tiết thành công",
          },
          "404": {
            description: "Không tìm thấy hình ảnh",
          },
        },
      },

      delete: {
        tags: ["Images"],
        summary: "Xóa hình ảnh của user hiện tại",

        security: [
          {
            bearerAuth: [],
          },
        ],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],

        responses: {
          "200": {
            description: "Xóa thành công",
          },
          "401": {
            description: "Chưa đăng nhập",
          },
          "403": {
            description: "Không có quyền xóa",
          },
        },
      },
    },

    "/api/comments/image/{id}": {
  get: {
    tags: ["Comments"],
    summary: "Lấy bình luận của hình ảnh",

    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],

    responses: {
      "200": {
        description: "Lấy bình luận thành công",
      },
    },
  },

  post: {
    tags: ["Comments"],
    summary: "Thêm bình luận",

    security: [
      {
        bearerAuth: [],
      },
    ],

    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],

    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["noi_dung"],
            properties: {
              noi_dung: {
                type: "string",
                example: "Hình này đẹp quá!",
              },
            },
          },
        },
      },
    },

    responses: {
      "201": {
        description: "Bình luận thành công",
      },
    },
  },
},

    "/api/users/me": {
      get: {
        tags: ["Users"],
        summary: "Lấy thông tin user hiện tại",

        security: [
          {
            bearerAuth: [],
          },
        ],

        responses: {
          "200": {
            description: "Lấy thông tin thành công",
          },
        },
      },

      put: {
        tags: ["Users"],
        summary: "Cập nhật thông tin user",

        security: [
          {
            bearerAuth: [],
          },
        ],

        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  ho_ten: {
                    type: "string",
                    example: "Nguyen Van B",
                  },
                  tuoi: {
                    type: "integer",
                    example: 23,
                  },
                  anh_dai_dien: {
                    type: "string",
                    example: "https://example.com/avatar.jpg",
                  },
                },
              },
            },
          },
        },

        responses: {
          "200": {
            description: "Cập nhật thành công",
          },
        },
      },
    },

    "/api/users/saved-images": {
      get: {
        tags: ["Users"],
        summary: "Lấy hình ảnh đã lưu",

        security: [
          {
            bearerAuth: [],
          },
        ],

        responses: {
          "200": {
            description: "Lấy hình ảnh đã lưu thành công",
          },
        },
      },
    },

    "/api/users/created-images": {
      get: {
        tags: ["Users"],
        summary: "Lấy hình ảnh do user tạo",

        security: [
          {
            bearerAuth: [],
          },
        ],

        responses: {
          "200": {
            description: "Lấy hình ảnh thành công",
          },
        },
      },
    },

    "/api/images/{id}/saved": {
      get: {
        tags: ["Save"],
        summary: "Kiểm tra hình đã được lưu chưa",

        security: [
          {
            bearerAuth: [],
          },
        ],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],

        responses: {
          "200": {
            description: "Kiểm tra thành công",
          },
        },
      },
    },

    "/api/images/{id}/save": {
      post: {
        tags: ["Save"],
        summary: "Lưu hình ảnh",

        security: [
          {
            bearerAuth: [],
          },
        ],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],

        responses: {
          "200": {
            description: "Lưu ảnh thành công",
          },
        },
      },

      delete: {
        tags: ["Save"],
        summary: "Bỏ lưu hình ảnh",

        security: [
          {
            bearerAuth: [],
          },
        ],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],

        responses: {
          "200": {
            description: "Bỏ lưu ảnh thành công",
          },
        },
      },
    },
  },
};

export const setupSwagger = (app: Express) => {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
  );
};