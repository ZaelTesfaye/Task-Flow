"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var error_js_1 = require("./utils/error.js");
console.log("API ERROR: ", error_js_1.APIError);
var express_1 = require("express");
var task_routes_js_1 = require("./routes/task.routes.js");
var user_routes_js_1 = require("./routes/user.routes.js");
var auth_routes_js_1 = require("./routes/auth.routes.js");
var config_js_1 = require("./config/config.js");
var socket_io_1 = require("socket.io");
var cookie_parser_1 = require("cookie-parser");
var auth_middleware_js_1 = require("./middlewares/auth.middleware.js");
var app = (0, express_1.default)();
app.set("view engine", "ejs");
app.use(express_1.default.static("public"));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)(config_js_1.default.cookieSecret));
app.use("api/auth", auth_routes_js_1.default);
app.use("api/tasks", auth_middleware_js_1.default, task_routes_js_1.default);
app.use("api/users", auth_middleware_js_1.default, user_routes_js_1.default);
app.use("api/health", function (req, res) { return res.send("OK"); });
// ejs
app.get("/home", function (req, res) {
    console.log("Serving /home page");
    res.render("index", {
        title: "Task Manager",
        message: "Welcome to the Task Manager Application!",
    });
});
app.use(function (req, res) {
    res.status(404).send("Not Found!");
});
app.use(function (error, req, res, next) {
    console.error(error);
    if (error instanceof error_js_1.APIError) {
        return res.status(400).send(error.message);
    }
    res.status(500).send("An error occurred");
});
var server = app.listen(config_js_1.default.port, function () {
    console.log("Server running on port ".concat(config_js_1.default.port));
});
var io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
io.on("connection", function (socket) {
    console.log("Socket connection established: ", socket);
});
var exitHandler = function (serverInstance) {
    if (serverInstance) {
        serverInstance.close(function () {
            console.log("Server closed");
            process.exit(1);
        });
    }
    else {
        process.exit(1);
    }
};
process.on("uncaughtException", function (error) {
    console.error(error);
    exitHandler(server);
});
process.on("unhandledRejection", function (error) {
    console.error(error);
    exitHandler(server);
});
