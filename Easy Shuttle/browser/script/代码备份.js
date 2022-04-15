


/*  以图搜图 写了一天发现找不到合适的 api 先放着吧，后面找到了再说  *********************************************
<!-- 以图搜图 >
<div class="soutu_warp">
    <div class="soutu_region">
        <span id="soutuTip">拖拽图片到这里</span>
    </div>
    <div class="soutu_but">
        <input type="file" class="select_img" id="selectImgFile" value="上传图片" />
        <span>选择文件</span>
    </div>
</div-->
.soutu_warp{
    padding: 1em 2em;
    box-shadow:0px 0px 2px #33333388;
}

.soutu_region{
    width: 80%;
    margin: 0 auto;
    line-height: 3em;
    text-align: center;
    overflow: hidden;
    box-sizing: border-box;
    border: 1px dashed #333333;
    background-color: rgba(255, 255, 255, 0.9);
}

.soutu_but{
    position: relative;
    width: 5em;
    line-height: 2em;
    text-align: center;
    background-color: rgba(0, 0, 255, 0.9);
    margin: 0 auto;
    margin-top: 1em;
    border-radius: 3px;
    box-shadow:0px 0px 5px #333333;
    color: #aaa;
}


.select_img{
    position: absolute;
    list-style: none;
    outline: 0;
    font-size: 0;
    -webkit-appearance: none;
    box-sizing: border-box;
    padding: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
    left: 0;
    top: 0;
    z-index: 1;
}

.close_sotu{
    height: 2em;
    width: 2em;
    display: block;
    background-repeat: no-repeat;
    background-size: 100%;
    background-image: url(./resources/svg/x.svg);
}




(() => {
    $('#selectImgFile').onchange=(e)=>{
        let file = e.currentTarget.files[0];
        $('#soutuTip').innerText = file.name;
        console.log(file);
    }
    let eInput = $('.soutu_warp')[0];
    //取消事件传播及默认行为
    let cancelDefault = eInput.ondragenter
        = eInput.ondragover
        = (e) => {
            e.stopPropagation();
            e.preventDefault();
        };
    eInput.ondrop = (e) => {
        //取消事件传播及默认行为
        cancelDefault(e);
        //获得拖进来的文件
        var data = e.dataTransfer;
        var files = data.files;
        //将其传给真正的处理文件的函数
        proImgFiles(files);
    };
    let proImgFiles = (files) => {
        var file = files[0];
        console.log(file)
        $('#soutuTip').innerText = file.name;
        //创建FileReader
        var reader = new FileReader();
        //读取图片
        reader.readAsDataURL(file);
        //准备好数据之后 //预览图片
        reader.onload = function (e) {
            let ePreview = document.getElementsByClassName('soutu_warp')[0];
            ePreview.style.backgroundImage = "url('" + e.target.result + "')";
        };
    }


})();

*/





