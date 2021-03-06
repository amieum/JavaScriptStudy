/**
 * Copyright (c) 2014,Egret-Labs.org
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Egret-Labs.org nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var egret;
(function (egret) {
    /**
     * @class egret.RenderFilter
     * @classdesc
     * @extends egret.HashObject
     */
    var RenderFilter = (function (_super) {
        __extends(RenderFilter, _super);
        function RenderFilter() {
            _super.call(this);
            this._originalData = {};
            this._drawAreaList = [];
        }
        /**
         * @method egret.egret.getInstance
         * @returns {RenderFilter}
         */
        RenderFilter.getInstance = function () {
            if (RenderFilter.instance == null) {
                RenderFilter.instance = new RenderFilter();
            }
            return RenderFilter.instance;
        };
        /**
         * @method egret.egret#addDrawArea
         * @param area {egret.Rectangle}
         */
        RenderFilter.prototype.addDrawArea = function (area) {
            this._drawAreaList.push(area);
        };
        /**
         * @method egret.egret#clearDrawArea
         */
        RenderFilter.prototype.clearDrawArea = function () {
            this._drawAreaList = [];
        };
        /**
         * ????????????????????????????????????????????????????????????????????????????????????
         * @method egret.egret#drawImage
         * @param renderContext {any}
         * @param data {RenderData}
         * @param sourceX {number}
         * @param sourceY {number}
         * @param sourceWidth {number}
         * @param sourceHeight {number}
         * @param destX {number}
         * @param destY {number}
         * @param destWidth {number}
         * @param destHeight {number}
         */
        RenderFilter.prototype.drawImage = function (renderContext, data, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, repeat) {
            if (repeat === void 0) { repeat = undefined; }
            destX = destX || 0;
            destY = destY || 0;
            var locTexture = data._texture_to_render;
            if (locTexture == null || sourceHeight == 0 || sourceWidth == 0 || destWidth == 0 || destHeight == 0) {
                return;
            }
            if (this._drawAreaList.length == 0 || !egret.MainContext.instance.rendererContext["_cacheCanvasContext"]) {
                renderContext.drawImage(locTexture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, repeat);
                return;
            }
            //??????worldBounds
            var bounds = egret.DisplayObject.getTransformBounds(data._getSize(egret.Rectangle.identity), data._worldTransform);
            data._worldBounds.initialize(bounds.x, bounds.y, bounds.width, bounds.height);
            var originalData = this._originalData;
            originalData.sourceX = sourceX;
            originalData.sourceY = sourceY;
            originalData.sourceWidth = sourceWidth;
            originalData.sourceHeight = sourceHeight;
            originalData.destX = destX;
            originalData.destY = destY;
            originalData.destWidth = destWidth;
            originalData.destHeight = destHeight;
            var locDrawAreaList = this.getDrawAreaList();
            for (var j = 0; j < locDrawAreaList.length; j++) {
                var drawArea = locDrawAreaList[j];
                if (this.ignoreRender(data, drawArea, originalData.destX, originalData.destY)) {
                    continue;
                }
                //?????????????????????????????????????????????????????????
                //                if (this._drawAreaList.length != 0) {
                //                    //???????????????????????????????????????????????????????????????
                //                    if (data._worldTransform.b != 0 || data._worldTransform.c != 0) {
                //                        //????????????????????????????????????????????????
                //                        if (data._worldBounds.x + originalData.destX < drawArea.x
                //                            || data._worldBounds.y + originalData.destY < drawArea.y
                //                            || data._worldBounds.x + data._worldBounds.width + originalData.destX > drawArea.x + drawArea.width
                //                            || data._worldBounds.y + data._worldBounds.height + originalData.destY > drawArea.y + drawArea.height) {
                //                            egret.Logger.fatal("??????????????????????????????????????????????????????????????????");
                //                            return;
                //                        }
                //                    }
                //                    else {
                //                        //???????????????????????????????????????????????????????????????????????????????????????????????????
                //                        var scaleX = data._worldTransform.a;
                //                        var scaleY = data._worldTransform.d;
                //                        var offset;
                //                        if (data._worldBounds.x + originalData.destX < drawArea.x) {
                //                            offset = (drawArea.x - data._worldBounds.x) / scaleX - originalData.destX;
                //                            sourceX += offset / (destWidth / sourceWidth);
                //                            sourceWidth -= offset / (destWidth / sourceWidth);
                //                            destWidth -= offset;
                //                            destX += offset;
                //                        }
                //                        if (data._worldBounds.y + originalData.destY < drawArea.y) {
                //                            offset = (drawArea.y - data._worldBounds.y) / scaleY - originalData.destY;
                //                            sourceY += offset / (destHeight / sourceHeight);
                //                            sourceHeight -= offset / (destHeight / sourceHeight);
                //                            destHeight -= offset;
                //                            destY += offset;
                //                        }
                //                        if (data._worldBounds.x + data._worldBounds.width + originalData.destX > drawArea.x + drawArea.width) {
                //                            offset = (data._worldBounds.x + data._worldBounds.width - drawArea.x - drawArea.width) / scaleX + originalData.destX;
                //                            sourceWidth -= offset / (destWidth / sourceWidth);
                //                            destWidth -= offset;
                //                        }
                //                        if (data._worldBounds.y + data._worldBounds.height + originalData.destY > drawArea.y + drawArea.height) {
                //                            offset = (data._worldBounds.y + data._worldBounds.height - drawArea.y - drawArea.height) / scaleY + originalData.destY;
                //                            sourceHeight -= offset / (destHeight / sourceHeight);
                //                            destHeight -= offset;
                //                        }
                //                    }
                //                }
                renderContext.drawImage(locTexture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, repeat);
            }
        };
        RenderFilter.prototype.ignoreRender = function (data, rect, destX, destY) {
            var bounds = data._worldBounds;
            var destX = destX * data._worldTransform.a;
            var destY = destY * data._worldTransform.d;
            if (bounds.x + bounds.width + destX <= rect.x || bounds.x + destX >= rect.x + rect.width || bounds.y + bounds.height + destY <= rect.y || bounds.y + destY >= rect.y + rect.height) {
                return true;
            }
            return false;
        };
        /**
         * @method egret.egret#getDrawAreaList
         * @returns {Rectangle}
         */
        RenderFilter.prototype.getDrawAreaList = function () {
            var locDrawAreaList;
            //????????????????????????????????????
            if (this._drawAreaList.length == 0) {
                if (!this._defaultDrawAreaList) {
                    this._defaultDrawAreaList = [new egret.Rectangle(0, 0, egret.MainContext.instance.stage.stageWidth, egret.MainContext.instance.stage.stageHeight)];
                }
                locDrawAreaList = this._defaultDrawAreaList;
            }
            else {
                locDrawAreaList = this._drawAreaList;
            }
            return locDrawAreaList;
        };
        return RenderFilter;
    })(egret.HashObject);
    egret.RenderFilter = RenderFilter;
    RenderFilter.prototype.__class__ = "egret.RenderFilter";
})(egret || (egret = {}));
