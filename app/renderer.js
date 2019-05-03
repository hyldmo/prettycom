"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = __importDefault(require("./server"));
// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var port = process.env.PORT || 1337;
var appendScript = function (name) {
    var script = document.createElement('script');
    script.src = process.env.NODE_ENV === 'development'
        ? "http://localhost:" + port + "/" + name + ".js?mode=" + process.env.NODE_ENV
        : "'./dist/" + name + ".js";
    // TODO: Writing the script path should be done with webpack
    document.body.appendChild(script);
};
appendScript('vendor');
appendScript('main');
var server = new server_1.default({ port: 31130 });
server.on('error', function (error) {
    console.warn(error);
});
window.onbeforeunload = function () {
    server.close();
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVuZGVyZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyZW5kZXJlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG9EQUE4QjtBQUU5Qix3REFBd0Q7QUFDeEQsdURBQXVEO0FBQ3ZELHlEQUF5RDtBQUN6RCxJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUE7QUFFckMsSUFBTSxZQUFZLEdBQUcsVUFBQyxJQUFZO0lBQ2pDLElBQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUE7SUFDL0MsTUFBTSxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsS0FBSyxhQUFhO1FBQ2xELENBQUMsQ0FBQyxzQkFBb0IsSUFBSSxTQUFJLElBQUksaUJBQVksT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFVO1FBQ3BFLENBQUMsQ0FBQyxhQUFXLElBQUksUUFBSyxDQUFBO0lBQ3ZCLDREQUE0RDtJQUM1RCxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUNsQyxDQUFDLENBQUE7QUFFRCxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDdEIsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBRXBCLElBQU0sTUFBTSxHQUFHLElBQUksZ0JBQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFBO0FBRTFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFVBQUMsS0FBSztJQUN4QixPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQ3BCLENBQUMsQ0FBQyxDQUFBO0FBRUYsTUFBTSxDQUFDLGNBQWMsR0FBRztJQUN2QixNQUFNLENBQUMsS0FBSyxFQUFFLENBQUE7QUFDZixDQUFDLENBQUEifQ==