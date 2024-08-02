/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/combined-stream";
exports.ids = ["vendor-chunks/combined-stream"];
exports.modules = {

/***/ "(ssr)/./node_modules/combined-stream/lib/combined_stream.js":
/*!*************************************************************!*\
  !*** ./node_modules/combined-stream/lib/combined_stream.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var util = __webpack_require__(/*! util */ \"util\");\nvar Stream = (__webpack_require__(/*! stream */ \"stream\").Stream);\nvar DelayedStream = __webpack_require__(/*! delayed-stream */ \"(ssr)/./node_modules/delayed-stream/lib/delayed_stream.js\");\nmodule.exports = CombinedStream;\nfunction CombinedStream() {\n    this.writable = false;\n    this.readable = true;\n    this.dataSize = 0;\n    this.maxDataSize = 2 * 1024 * 1024;\n    this.pauseStreams = true;\n    this._released = false;\n    this._streams = [];\n    this._currentStream = null;\n    this._insideLoop = false;\n    this._pendingNext = false;\n}\nutil.inherits(CombinedStream, Stream);\nCombinedStream.create = function(options) {\n    var combinedStream = new this();\n    options = options || {};\n    for(var option in options){\n        combinedStream[option] = options[option];\n    }\n    return combinedStream;\n};\nCombinedStream.isStreamLike = function(stream) {\n    return typeof stream !== \"function\" && typeof stream !== \"string\" && typeof stream !== \"boolean\" && typeof stream !== \"number\" && !Buffer.isBuffer(stream);\n};\nCombinedStream.prototype.append = function(stream) {\n    var isStreamLike = CombinedStream.isStreamLike(stream);\n    if (isStreamLike) {\n        if (!(stream instanceof DelayedStream)) {\n            var newStream = DelayedStream.create(stream, {\n                maxDataSize: Infinity,\n                pauseStream: this.pauseStreams\n            });\n            stream.on(\"data\", this._checkDataSize.bind(this));\n            stream = newStream;\n        }\n        this._handleErrors(stream);\n        if (this.pauseStreams) {\n            stream.pause();\n        }\n    }\n    this._streams.push(stream);\n    return this;\n};\nCombinedStream.prototype.pipe = function(dest, options) {\n    Stream.prototype.pipe.call(this, dest, options);\n    this.resume();\n    return dest;\n};\nCombinedStream.prototype._getNext = function() {\n    this._currentStream = null;\n    if (this._insideLoop) {\n        this._pendingNext = true;\n        return; // defer call\n    }\n    this._insideLoop = true;\n    try {\n        do {\n            this._pendingNext = false;\n            this._realGetNext();\n        }while (this._pendingNext);\n    } finally{\n        this._insideLoop = false;\n    }\n};\nCombinedStream.prototype._realGetNext = function() {\n    var stream = this._streams.shift();\n    if (typeof stream == \"undefined\") {\n        this.end();\n        return;\n    }\n    if (typeof stream !== \"function\") {\n        this._pipeNext(stream);\n        return;\n    }\n    var getStream = stream;\n    getStream((function(stream) {\n        var isStreamLike = CombinedStream.isStreamLike(stream);\n        if (isStreamLike) {\n            stream.on(\"data\", this._checkDataSize.bind(this));\n            this._handleErrors(stream);\n        }\n        this._pipeNext(stream);\n    }).bind(this));\n};\nCombinedStream.prototype._pipeNext = function(stream) {\n    this._currentStream = stream;\n    var isStreamLike = CombinedStream.isStreamLike(stream);\n    if (isStreamLike) {\n        stream.on(\"end\", this._getNext.bind(this));\n        stream.pipe(this, {\n            end: false\n        });\n        return;\n    }\n    var value = stream;\n    this.write(value);\n    this._getNext();\n};\nCombinedStream.prototype._handleErrors = function(stream) {\n    var self = this;\n    stream.on(\"error\", function(err) {\n        self._emitError(err);\n    });\n};\nCombinedStream.prototype.write = function(data) {\n    this.emit(\"data\", data);\n};\nCombinedStream.prototype.pause = function() {\n    if (!this.pauseStreams) {\n        return;\n    }\n    if (this.pauseStreams && this._currentStream && typeof this._currentStream.pause == \"function\") this._currentStream.pause();\n    this.emit(\"pause\");\n};\nCombinedStream.prototype.resume = function() {\n    if (!this._released) {\n        this._released = true;\n        this.writable = true;\n        this._getNext();\n    }\n    if (this.pauseStreams && this._currentStream && typeof this._currentStream.resume == \"function\") this._currentStream.resume();\n    this.emit(\"resume\");\n};\nCombinedStream.prototype.end = function() {\n    this._reset();\n    this.emit(\"end\");\n};\nCombinedStream.prototype.destroy = function() {\n    this._reset();\n    this.emit(\"close\");\n};\nCombinedStream.prototype._reset = function() {\n    this.writable = false;\n    this._streams = [];\n    this._currentStream = null;\n};\nCombinedStream.prototype._checkDataSize = function() {\n    this._updateDataSize();\n    if (this.dataSize <= this.maxDataSize) {\n        return;\n    }\n    var message = \"DelayedStream#maxDataSize of \" + this.maxDataSize + \" bytes exceeded.\";\n    this._emitError(new Error(message));\n};\nCombinedStream.prototype._updateDataSize = function() {\n    this.dataSize = 0;\n    var self = this;\n    this._streams.forEach(function(stream) {\n        if (!stream.dataSize) {\n            return;\n        }\n        self.dataSize += stream.dataSize;\n    });\n    if (this._currentStream && this._currentStream.dataSize) {\n        this.dataSize += this._currentStream.dataSize;\n    }\n};\nCombinedStream.prototype._emitError = function(err) {\n    this._reset();\n    this.emit(\"error\", err);\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvY29tYmluZWQtc3RyZWFtL2xpYi9jb21iaW5lZF9zdHJlYW0uanMiLCJtYXBwaW5ncyI6IkFBQUEsSUFBSUEsT0FBT0MsbUJBQU9BLENBQUM7QUFDbkIsSUFBSUMsU0FBU0Qsb0RBQXdCO0FBQ3JDLElBQUlFLGdCQUFnQkYsbUJBQU9BLENBQUM7QUFFNUJHLE9BQU9DLE9BQU8sR0FBR0M7QUFDakIsU0FBU0E7SUFDUCxJQUFJLENBQUNDLFFBQVEsR0FBRztJQUNoQixJQUFJLENBQUNDLFFBQVEsR0FBRztJQUNoQixJQUFJLENBQUNDLFFBQVEsR0FBRztJQUNoQixJQUFJLENBQUNDLFdBQVcsR0FBRyxJQUFJLE9BQU87SUFDOUIsSUFBSSxDQUFDQyxZQUFZLEdBQUc7SUFFcEIsSUFBSSxDQUFDQyxTQUFTLEdBQUc7SUFDakIsSUFBSSxDQUFDQyxRQUFRLEdBQUcsRUFBRTtJQUNsQixJQUFJLENBQUNDLGNBQWMsR0FBRztJQUN0QixJQUFJLENBQUNDLFdBQVcsR0FBRztJQUNuQixJQUFJLENBQUNDLFlBQVksR0FBRztBQUN0QjtBQUNBaEIsS0FBS2lCLFFBQVEsQ0FBQ1gsZ0JBQWdCSjtBQUU5QkksZUFBZVksTUFBTSxHQUFHLFNBQVNDLE9BQU87SUFDdEMsSUFBSUMsaUJBQWlCLElBQUksSUFBSTtJQUU3QkQsVUFBVUEsV0FBVyxDQUFDO0lBQ3RCLElBQUssSUFBSUUsVUFBVUYsUUFBUztRQUMxQkMsY0FBYyxDQUFDQyxPQUFPLEdBQUdGLE9BQU8sQ0FBQ0UsT0FBTztJQUMxQztJQUVBLE9BQU9EO0FBQ1Q7QUFFQWQsZUFBZWdCLFlBQVksR0FBRyxTQUFTQyxNQUFNO0lBQzNDLE9BQU8sT0FBUUEsV0FBVyxjQUNwQixPQUFPQSxXQUFXLFlBQ2xCLE9BQU9BLFdBQVcsYUFDbEIsT0FBT0EsV0FBVyxZQUNsQixDQUFDQyxPQUFPQyxRQUFRLENBQUNGO0FBQ3pCO0FBRUFqQixlQUFlb0IsU0FBUyxDQUFDQyxNQUFNLEdBQUcsU0FB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SUFDaEMsSUFBSSxDQUFDL0MsUUFBUSxHQUFHO0lBQ2hCLElBQUksQ0FBQ00sUUFBUSxHQUFHLEVBQUU7SUFDbEIsSUFBSSxDQUFDQyxjQUFjLEdBQUc7QUFDeEI7QUFFQVIsZUFBZW9CLFNBQVMsQ0FBQ00sY0FBYyxHQUFHO0lBQ3hDLElBQUksQ0FBQ3dCLGVBQWU7SUFDcEIsSUFBSSxJQUFJLENBQUMvQyxRQUFRLElBQUksSUFBSSxDQUFDQyxXQUFXLEVBQUU7UUFDckM7SUFDRjtJQUVBLElBQUkrQyxVQUNGLGtDQUFrQyxJQUFJLENBQUMvQyxXQUFXLEdBQUc7SUFDdkQsSUFBSSxDQUFDeUMsVUFBVSxDQUFDLElBQUlPLE1BQU1EO0FBQzVCO0FBRUFuRCxlQUFlb0IsU0FBUyxDQUFDOEIsZUFBZSxHQUFHO0lBQ3pDLElBQUksQ0FBQy9DLFFBQVEsR0FBRztJQUVoQixJQUFJd0MsT0FBTyxJQUFJO0lBQ2YsSUFBSSxDQUFDcEMsUUFBUSxDQUFDOEMsT0FBTyxDQUFDLFNBQVNwQyxNQUFNO1FBQ25DLElBQUksQ0FBQ0EsT0FBT2QsUUFBUSxFQUFFO1lBQ3BCO1FBQ0Y7UUFFQXdDLEtBQUt4QyxRQUFRLElBQUljLE9BQU9kLFFBQVE7SUFDbEM7SUFFQSxJQUFJLElBQUksQ0FBQ0ssY0FBYyxJQUFJLElBQUksQ0FBQ0EsY0FBYyxDQUFDTCxRQUFRLEVBQUU7UUFDdkQsSUFBSSxDQUFDQSxRQUFRLElBQUksSUFBSSxDQUFDSyxjQUFjLENBQUNMLFFBQVE7SUFDL0M7QUFDRjtBQUVBSCxlQUFlb0IsU0FBUyxDQUFDeUIsVUFBVSxHQUFHLFNBQVNELEdBQUc7SUFDaEQsSUFBSSxDQUFDSSxNQUFNO0lBQ1gsSUFBSSxDQUFDRCxJQUFJLENBQUMsU0FBU0g7QUFDckIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9waXJ1bnJhai8uL25vZGVfbW9kdWxlcy9jb21iaW5lZC1zdHJlYW0vbGliL2NvbWJpbmVkX3N0cmVhbS5qcz82YWE1Il0sInNvdXJjZXNDb250ZW50IjpbInZhciB1dGlsID0gcmVxdWlyZSgndXRpbCcpO1xudmFyIFN0cmVhbSA9IHJlcXVpcmUoJ3N0cmVhbScpLlN0cmVhbTtcbnZhciBEZWxheWVkU3RyZWFtID0gcmVxdWlyZSgnZGVsYXllZC1zdHJlYW0nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBDb21iaW5lZFN0cmVhbTtcbmZ1bmN0aW9uIENvbWJpbmVkU3RyZWFtKCkge1xuICB0aGlzLndyaXRhYmxlID0gZmFsc2U7XG4gIHRoaXMucmVhZGFibGUgPSB0cnVlO1xuICB0aGlzLmRhdGFTaXplID0gMDtcbiAgdGhpcy5tYXhEYXRhU2l6ZSA9IDIgKiAxMDI0ICogMTAyNDtcbiAgdGhpcy5wYXVzZVN0cmVhbXMgPSB0cnVlO1xuXG4gIHRoaXMuX3JlbGVhc2VkID0gZmFsc2U7XG4gIHRoaXMuX3N0cmVhbXMgPSBbXTtcbiAgdGhpcy5fY3VycmVudFN0cmVhbSA9IG51bGw7XG4gIHRoaXMuX2luc2lkZUxvb3AgPSBmYWxzZTtcbiAgdGhpcy5fcGVuZGluZ05leHQgPSBmYWxzZTtcbn1cbnV0aWwuaW5oZXJpdHMoQ29tYmluZWRTdHJlYW0sIFN0cmVhbSk7XG5cbkNvbWJpbmVkU3RyZWFtLmNyZWF0ZSA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgdmFyIGNvbWJpbmVkU3RyZWFtID0gbmV3IHRoaXMoKTtcblxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgZm9yICh2YXIgb3B0aW9uIGluIG9wdGlvbnMpIHtcbiAgICBjb21iaW5lZFN0cmVhbVtvcHRpb25dID0gb3B0aW9uc1tvcHRpb25dO1xuICB9XG5cbiAgcmV0dXJuIGNvbWJpbmVkU3RyZWFtO1xufTtcblxuQ29tYmluZWRTdHJlYW0uaXNTdHJlYW1MaWtlID0gZnVuY3Rpb24oc3RyZWFtKSB7XG4gIHJldHVybiAodHlwZW9mIHN0cmVhbSAhPT0gJ2Z1bmN0aW9uJylcbiAgICAmJiAodHlwZW9mIHN0cmVhbSAhPT0gJ3N0cmluZycpXG4gICAgJiYgKHR5cGVvZiBzdHJlYW0gIT09ICdib29sZWFuJylcbiAgICAmJiAodHlwZW9mIHN0cmVhbSAhPT0gJ251bWJlcicpXG4gICAgJiYgKCFCdWZmZXIuaXNCdWZmZXIoc3RyZWFtKSk7XG59O1xuXG5Db21iaW5lZFN0cmVhbS5wcm90b3R5cGUuYXBwZW5kID0gZnVuY3Rpb24oc3RyZWFtKSB7XG4gIHZhciBpc1N0cmVhbUxpa2UgPSBDb21iaW5lZFN0cmVhbS5pc1N0cmVhbUxpa2Uoc3RyZWFtKTtcblxuICBpZiAoaXNTdHJlYW1MaWtlKSB7XG4gICAgaWYgKCEoc3RyZWFtIGluc3RhbmNlb2YgRGVsYXllZFN0cmVhbSkpIHtcbiAgICAgIHZhciBuZXdTdHJlYW0gPSBEZWxheWVkU3RyZWFtLmNyZWF0ZShzdHJlYW0sIHtcbiAgICAgICAgbWF4RGF0YVNpemU6IEluZmluaXR5LFxuICAgICAgICBwYXVzZVN0cmVhbTogdGhpcy5wYXVzZVN0cmVhbXMsXG4gICAgICB9KTtcbiAgICAgIHN0cmVhbS5vbignZGF0YScsIHRoaXMuX2NoZWNrRGF0YVNpemUuYmluZCh0aGlzKSk7XG4gICAgICBzdHJlYW0gPSBuZXdTdHJlYW07XG4gICAgfVxuXG4gICAgdGhpcy5faGFuZGxlRXJyb3JzKHN0cmVhbSk7XG5cbiAgICBpZiAodGhpcy5wYXVzZVN0cmVhbXMpIHtcbiAgICAgIHN0cmVhbS5wYXVzZSgpO1xuICAgIH1cbiAgfVxuXG4gIHRoaXMuX3N0cmVhbXMucHVzaChzdHJlYW0pO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkNvbWJpbmVkU3RyZWFtLnByb3RvdHlwZS5waXBlID0gZnVuY3Rpb24oZGVzdCwgb3B0aW9ucykge1xuICBTdHJlYW0ucHJvdG90eXBlLnBpcGUuY2FsbCh0aGlzLCBkZXN0LCBvcHRpb25zKTtcbiAgdGhpcy5yZXN1bWUoKTtcbiAgcmV0dXJuIGRlc3Q7XG59O1xuXG5Db21iaW5lZFN0cmVhbS5wcm90b3R5cGUuX2dldE5leHQgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5fY3VycmVudFN0cmVhbSA9IG51bGw7XG5cbiAgaWYgKHRoaXMuX2luc2lkZUxvb3ApIHtcbiAgICB0aGlzLl9wZW5kaW5nTmV4dCA9IHRydWU7XG4gICAgcmV0dXJuOyAvLyBkZWZlciBjYWxsXG4gIH1cblxuICB0aGlzLl9pbnNpZGVMb29wID0gdHJ1ZTtcbiAgdHJ5IHtcbiAgICBkbyB7XG4gICAgICB0aGlzLl9wZW5kaW5nTmV4dCA9IGZhbHNlO1xuICAgICAgdGhpcy5fcmVhbEdldE5leHQoKTtcbiAgICB9IHdoaWxlICh0aGlzLl9wZW5kaW5nTmV4dCk7XG4gIH0gZmluYWxseSB7XG4gICAgdGhpcy5faW5zaWRlTG9vcCA9IGZhbHNlO1xuICB9XG59O1xuXG5Db21iaW5lZFN0cmVhbS5wcm90b3R5cGUuX3JlYWxHZXROZXh0ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBzdHJlYW0gPSB0aGlzLl9zdHJlYW1zLnNoaWZ0KCk7XG5cblxuICBpZiAodHlwZW9mIHN0cmVhbSA9PSAndW5kZWZpbmVkJykge1xuICAgIHRoaXMuZW5kKCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBzdHJlYW0gIT09ICdmdW5jdGlvbicpIHtcbiAgICB0aGlzLl9waXBlTmV4dChzdHJlYW0pO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciBnZXRTdHJlYW0gPSBzdHJlYW07XG4gIGdldFN0cmVhbShmdW5jdGlvbihzdHJlYW0pIHtcbiAgICB2YXIgaXNTdHJlYW1MaWtlID0gQ29tYmluZWRTdHJlYW0uaXNTdHJlYW1MaWtlKHN0cmVhbSk7XG4gICAgaWYgKGlzU3RyZWFtTGlrZSkge1xuICAgICAgc3RyZWFtLm9uKCdkYXRhJywgdGhpcy5fY2hlY2tEYXRhU2l6ZS5iaW5kKHRoaXMpKTtcbiAgICAgIHRoaXMuX2hhbmRsZUVycm9ycyhzdHJlYW0pO1xuICAgIH1cblxuICAgIHRoaXMuX3BpcGVOZXh0KHN0cmVhbSk7XG4gIH0uYmluZCh0aGlzKSk7XG59O1xuXG5Db21iaW5lZFN0cmVhbS5wcm90b3R5cGUuX3BpcGVOZXh0ID0gZnVuY3Rpb24oc3RyZWFtKSB7XG4gIHRoaXMuX2N1cnJlbnRTdHJlYW0gPSBzdHJlYW07XG5cbiAgdmFyIGlzU3RyZWFtTGlrZSA9IENvbWJpbmVkU3RyZWFtLmlzU3RyZWFtTGlrZShzdHJlYW0pO1xuICBpZiAoaXNTdHJlYW1MaWtlKSB7XG4gICAgc3RyZWFtLm9uKCdlbmQnLCB0aGlzLl9nZXROZXh0LmJpbmQodGhpcykpO1xuICAgIHN0cmVhbS5waXBlKHRoaXMsIHtlbmQ6IGZhbHNlfSk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIHZhbHVlID0gc3RyZWFtO1xuICB0aGlzLndyaXRlKHZhbHVlKTtcbiAgdGhpcy5fZ2V0TmV4dCgpO1xufTtcblxuQ29tYmluZWRTdHJlYW0ucHJvdG90eXBlLl9oYW5kbGVFcnJvcnMgPSBmdW5jdGlvbihzdHJlYW0pIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBzdHJlYW0ub24oJ2Vycm9yJywgZnVuY3Rpb24oZXJyKSB7XG4gICAgc2VsZi5fZW1pdEVycm9yKGVycik7XG4gIH0pO1xufTtcblxuQ29tYmluZWRTdHJlYW0ucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24oZGF0YSkge1xuICB0aGlzLmVtaXQoJ2RhdGEnLCBkYXRhKTtcbn07XG5cbkNvbWJpbmVkU3RyZWFtLnByb3RvdHlwZS5wYXVzZSA9IGZ1bmN0aW9uKCkge1xuICBpZiAoIXRoaXMucGF1c2VTdHJlYW1zKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYodGhpcy5wYXVzZVN0cmVhbXMgJiYgdGhpcy5fY3VycmVudFN0cmVhbSAmJiB0eXBlb2YodGhpcy5fY3VycmVudFN0cmVhbS5wYXVzZSkgPT0gJ2Z1bmN0aW9uJykgdGhpcy5fY3VycmVudFN0cmVhbS5wYXVzZSgpO1xuICB0aGlzLmVtaXQoJ3BhdXNlJyk7XG59O1xuXG5Db21iaW5lZFN0cmVhbS5wcm90b3R5cGUucmVzdW1lID0gZnVuY3Rpb24oKSB7XG4gIGlmICghdGhpcy5fcmVsZWFzZWQpIHtcbiAgICB0aGlzLl9yZWxlYXNlZCA9IHRydWU7XG4gICAgdGhpcy53cml0YWJsZSA9IHRydWU7XG4gICAgdGhpcy5fZ2V0TmV4dCgpO1xuICB9XG5cbiAgaWYodGhpcy5wYXVzZVN0cmVhbXMgJiYgdGhpcy5fY3VycmVudFN0cmVhbSAmJiB0eXBlb2YodGhpcy5fY3VycmVudFN0cmVhbS5yZXN1bWUpID09ICdmdW5jdGlvbicpIHRoaXMuX2N1cnJlbnRTdHJlYW0ucmVzdW1lKCk7XG4gIHRoaXMuZW1pdCgncmVzdW1lJyk7XG59O1xuXG5Db21iaW5lZFN0cmVhbS5wcm90b3R5cGUuZW5kID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuX3Jlc2V0KCk7XG4gIHRoaXMuZW1pdCgnZW5kJyk7XG59O1xuXG5Db21iaW5lZFN0cmVhbS5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLl9yZXNldCgpO1xuICB0aGlzLmVtaXQoJ2Nsb3NlJyk7XG59O1xuXG5Db21iaW5lZFN0cmVhbS5wcm90b3R5cGUuX3Jlc2V0ID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMud3JpdGFibGUgPSBmYWxzZTtcbiAgdGhpcy5fc3RyZWFtcyA9IFtdO1xuICB0aGlzLl9jdXJyZW50U3RyZWFtID0gbnVsbDtcbn07XG5cbkNvbWJpbmVkU3RyZWFtLnByb3RvdHlwZS5fY2hlY2tEYXRhU2l6ZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLl91cGRhdGVEYXRhU2l6ZSgpO1xuICBpZiAodGhpcy5kYXRhU2l6ZSA8PSB0aGlzLm1heERhdGFTaXplKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIG1lc3NhZ2UgPVxuICAgICdEZWxheWVkU3RyZWFtI21heERhdGFTaXplIG9mICcgKyB0aGlzLm1heERhdGFTaXplICsgJyBieXRlcyBleGNlZWRlZC4nO1xuICB0aGlzLl9lbWl0RXJyb3IobmV3IEVycm9yKG1lc3NhZ2UpKTtcbn07XG5cbkNvbWJpbmVkU3RyZWFtLnByb3RvdHlwZS5fdXBkYXRlRGF0YVNpemUgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5kYXRhU2l6ZSA9IDA7XG5cbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB0aGlzLl9zdHJlYW1zLmZvckVhY2goZnVuY3Rpb24oc3RyZWFtKSB7XG4gICAgaWYgKCFzdHJlYW0uZGF0YVNpemUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBzZWxmLmRhdGFTaXplICs9IHN0cmVhbS5kYXRhU2l6ZTtcbiAgfSk7XG5cbiAgaWYgKHRoaXMuX2N1cnJlbnRTdHJlYW0gJiYgdGhpcy5fY3VycmVudFN0cmVhbS5kYXRhU2l6ZSkge1xuICAgIHRoaXMuZGF0YVNpemUgKz0gdGhpcy5fY3VycmVudFN0cmVhbS5kYXRhU2l6ZTtcbiAgfVxufTtcblxuQ29tYmluZWRTdHJlYW0ucHJvdG90eXBlLl9lbWl0RXJyb3IgPSBmdW5jdGlvbihlcnIpIHtcbiAgdGhpcy5fcmVzZXQoKTtcbiAgdGhpcy5lbWl0KCdlcnJvcicsIGVycik7XG59O1xuIl0sIm5hbWVzIjpbInV0aWwiLCJyZXF1aXJlIiwiU3RyZWFtIiwiRGVsYXllZFN0cmVhbSIsIm1vZHVsZSIsImV4cG9ydHMiLCJDb21iaW5lZFN0cmVhbSIsIndyaXRhYmxlIiwicmVhZGFibGUiLCJkYXRhU2l6ZSIsIm1heERhdGFTaXplIiwicGF1c2VTdHJlYW1zIiwiX3JlbGVhc2VkIiwiX3N0cmVhbXMiLCJfY3VycmVudFN0cmVhbSIsIl9pbnNpZGVMb29wIiwiX3BlbmRpbmdOZXh0IiwiaW5oZXJpdHMiLCJjcmVhdGUiLCJvcHRpb25zIiwiY29tYmluZWRTdHJlYW0iLCJvcHRpb24iLCJpc1N0cmVhbUxpa2UiLCJzdHJlYW0iLCJCdWZmZXIiLCJpc0J1ZmZlciIsInByb3RvdHlwZSIsImFwcGVuZCIsIm5ld1N0cmVhbSIsIkluZmluaXR5IiwicGF1c2VTdHJlYW0iLCJvbiIsIl9jaGVja0RhdGFTaXplIiwiYmluZCIsIl9oYW5kbGVFcnJvcnMiLCJwYXVzZSIsInB1c2giLCJwaXBlIiwiZGVzdCIsImNhbGwiLCJyZXN1bWUiLCJfZ2V0TmV4dCIsIl9yZWFsR2V0TmV4dCIsInNoaWZ0IiwiZW5kIiwiX3BpcGVOZXh0IiwiZ2V0U3RyZWFtIiwidmFsdWUiLCJ3cml0ZSIsInNlbGYiLCJlcnIiLCJfZW1pdEVycm9yIiwiZGF0YSIsImVtaXQiLCJfcmVzZXQiLCJkZXN0cm95IiwiX3VwZGF0ZURhdGFTaXplIiwibWVzc2FnZSIsIkVycm9yIiwiZm9yRWFjaCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/combined-stream/lib/combined_stream.js\n");

/***/ })

};
;