<template>
    <div style="width: 100%;height: 100%;">
        <div align="right">
            <el-input
                    placeholder="按案件名查询"
                    v-model="caseName"
                    style="width: 250px;margin: 0px;padding: 0px;"
                    size="small"
                    prefix-icon="el-icon-search"
                    clearable>
            </el-input>
            <el-button type="primary" size="small" style="margin-left: 10px" @click="searchMarker">搜索</el-button>
        </div>
        <!--地图容器-->
        <div style="width: 100%;height: 96.4%;overflow: hidden;border:1px solid gray" id="map_container">
        </div>
    </div>
</template>
<script>
import axios from 'axios'
    export default {
        name: '',
        data() {
            return {
                caseName: '',
                map: null,
                e: {lng: null, lat:null, text: null}
            }
        },
        methods: {
            searchMarker() {
                let __this = this;
                axios.get("/map/pitchByCaseName",{params:{caseName:__this.caseName}}).then(resp => {
                   var data=resp.data
                   data.forEach(element => {
                        __this.pointMarker(element);
                   });
                   
                }, resp => {
                    if (resp.response.status == 403) {
                    
                    }
 
                });
            },
            pointMarker(data) {
                let __this = this;
                let point = new BMap.Point(data.lng, data.lat); // 点坐标
                let marker = new BMap.Marker(point);
                let opts = {
                    width: 210, // 信息窗口宽度
                    height: 125, // 信息窗口高度
                    title: '<h4>' + data.name + '</h4>', // 信息窗口标题
                    enableMessage: true, //设置允许信息窗发送短息
                    message: ""
                };
                let infoWindow = new BMap.InfoWindow("<br>经度:" + data.lng + "<br>纬度:" + data.lat, opts); // 创建信息窗口对象
                __this.map.openInfoWindow(infoWindow, point); //开启信息窗口
                __this.map.addOverlay(marker);
            },
            createMaker(e) {
              let __this = this;
              __this.pointMarker(e);
            },
        },
        created() {
            let __this = this;
        },
        mounted() {
            let __this = this;
            __this.map = new BMap.Map("map_container");      //设置卫星图为底图
            let point = new BMap.Point(117.32, 34.82);    // 创建点坐标
            __this.map.centerAndZoom(point, 13);                     // 初始化地图,设置中心点坐标和地图级别。
            __this.map.setCurrentCity("枣庄");
            __this.map.addControl(new BMap.MapTypeControl());
            __this.map.addControl(new BMap.NavigationControl());
            __this.map.enableScrollWheelZoom();                  // 启用滚轮放大缩小。
            __this.map.enableKeyboard();                         // 启用键盘操作。
            //画矩形
            let styleOptions = {
                strokeColor: "red",    //边线颜色。
                fillColor: "red",      //填充颜色。当参数为空时，圆形将没有填充效果。
                strokeWeight: 1,       //边线的宽度，以像素为单位。
                strokeOpacity: 0.8,	   //边线透明度，取值范围0 - 1。
                fillOpacity: 0.4,      //填充的透明度，取值范围0 - 1。
                strokeStyle: 'solid' //边线的样式，solid或dashed。
            }
            //实例化鼠标绘制工具
            let drawingManager = new BMapLib.DrawingManager(__this.map, {
                isOpen: false, //是否开启绘制模式
                enableDrawingTool: true, //是否显示工具栏
                drawingToolOptions: {
                    anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
                    offset: new BMap.Size(5, 5), //偏离值
                    drawingModes: [
                        BMAP_DRAWING_MARKER,
                        BMAP_DRAWING_CIRCLE,
                        BMAP_DRAWING_POLYLINE,
                        BMAP_DRAWING_RECTANGLE
                    ],
                    scale: 0.5 //工具栏缩放比例
                },
                circleOptions: styleOptions, //圆的样式
                polylineOptions: styleOptions, //线的样式
                polygonOptions: styleOptions, //多边形的样式
                rectangleOptions: styleOptions //矩形的样式
            });
            __this.map.addControl(new BMap.MapTypeControl({
                mapTypes: [
                    BMAP_NORMAL_MAP
                ]
            }));
            //添加鼠标绘制工具监听事件，用于获取绘制结果
            drawingManager.addEventListener('rectanglecomplete', function (e) {

                let b = e.getBounds();

                if (typeof (window.external.SetScale) != 'undefined') {
                    window.external.SetScale(b.getSouthWest().lng, b.getSouthWest().lat, b.getNorthEast().lng, b.getNorthEast().lat);
                }
            });
            __this.createMaker(__this.e);
        },
    }
</script>
<style type="text/css">
    body, html, #map_container {
        width: 100%;
        height: 100%;
        overflow: hidden;
        margin: 0;
    }

    .anchorBL {
        display: none;
    }
</style>
