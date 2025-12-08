/*
 * Filename: \centosa\piden\hurman\converter\content.js
 * Path: \centosa\piden\hurman\converter
 * Created Date: Tuesday, March 3rd 2020, 11:27:19 pm
 * Author: Hurman
 * Email: HurmanKz@Hotmail.com
 * Copyright (c) 2020 Kristal Corpuration.
 */

var page = 1;
var total = 1;
var totalPage = 1;
var token = "";
var query = "";
var underReviewVideoList = [];
var allVideoList = [];

var isMaterialPage = false;
var isVideoMaterialPage = false;
var isVideoMaterialPageSearch = false;
var isAudioMaterialPage = false;

/**
 * Fetch Video List By Page
 * @param {*} page 
 */
function saveToLocalStorage(list) {
  localStorage.setItem("mplist", list);
}
//weui-desktop-search__btn
function searchVideoList (page) {
  // https://mp.weixin.qq.com/cgi-bin/appmsg?begin=0&count=10&t=media/video_list&action=list_video&type=15&query=697&token=1266859857&lang=zh_CN
  let begin = (page - 1) * 10;
  // https://mp.weixin.qq.com/cgi-bin/appmsg?action=list_video&t=media/video_list&type=15&begin=1&count=10&token=1002863968&lang=zh_CN&f=json&ajax=1
  let url = `https://mp.weixin.qq.com/cgi-bin/appmsg?action=list_video&t=media/video_list&type=15&begin=${begin}&count=10&query=${query}&token=${token}&lang=zh_CN&f=json&ajax=1`;
  let xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.onload = function () {
    if (xhr.status === 200) {
      let data = JSON.parse(xhr.responseText);
      let list = data["app_msg_info"]["item"];
      let vidCount = data["app_msg_info"]["file_cnt"]["video_msg_cnt"];
      totalPage = Math.ceil(vidCount / 9);
      let timeOut = setTimeout(() => {
        document.querySelector(".weui-desktop-table__bd").querySelectorAll("tr").forEach((tr, index) => {
          if (!list[index].content) {
            let urlParams = new URLSearchParams(list[index].content_url);
            list[index].content = urlParams.get("vid");
          }
          tr.children[2].innerHTML = tr.children[2].innerHTML + "(" + list[index].title + ")" + list[index].content;
        });
        clearTimeout(timeOut);
      }, 2500);
    } else {
      // wx failed
    }
  }
  xhr.send();
}
function fetchVideoList (page) {
  let begin = (page - 1) * 10;
  // https://mp.weixin.qq.com/cgi-bin/appmsg?action=list_video&t=media/video_list&type=15&begin=1&count=10&token=1002863968&lang=zh_CN&f=json&ajax=1
  let url = `https://mp.weixin.qq.com/cgi-bin/appmsg?action=list_video&t=media/video_list&type=15&begin=${begin}&count=10&token=${token}&lang=zh_CN&f=json&ajax=1`;
  let xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.onload = function () {
    if (xhr.status === 200) {
      let data = JSON.parse(xhr.responseText);
      let list = data["app_msg_info"]["item"];
      let vidCount = data["app_msg_info"]["file_cnt"]["video_msg_cnt"];
      totalPage = Math.ceil(vidCount / 9);
      let timeOut = setTimeout(() => {
        document.querySelector(".weui-desktop-table__bd").querySelectorAll("tr").forEach((tr, index) => {

          if (!list[index]) return;
          // mytr
          tr.children[2].innerHTML = tr.children[2].innerHTML + "<br>(" + list[index].title + ")<br>" + list[index].content + "<br>" + list[index]["content_url"] + "<br>";

          let container = document.createElement("div");
          let videoUrls = [];
          getVideoUrls(list[index].content).then(res => {
            videoUrls = res;
            videoUrls.forEach((urlinfo) => {
              let playBtn = createPlayBtn(urlinfo);
              container.appendChild(playBtn);
            });
          });
          
          tr.querySelector(".weui-desktop-link-group.weui-desktop-link-group_icons").appendChild(container);
        });
        clearTimeout(timeOut);
      }, 2500);
    } else {
      // wx failed
    }
  }
  xhr.send();
}

function createPlayBtn(urlinfo) {
  let playBtn = document.createElement("a");
  playBtn.style.padding = "2px 5px";
  playBtn.style.margin = "5px";
  playBtn.style.fontWeight = "bold";
  playBtn.style.display = "inline-block";
  playBtn.style.background = "#00000080";
  playBtn.style.color = "#ffffff";
  playBtn.style.fontSize = "12px";
  playBtn.innerHTML = `
    <div>${urlinfo["video_quality_wording"]}</div>
    <div>${urlinfo["width"]}X${urlinfo["height"]}</div>
    <div>${parseInt(urlinfo["filesize"]/(1024*1024))}MB</div>
    <div>${parseInt(urlinfo["duration_ms"]/(1000*60))}:${parseInt((urlinfo["duration_ms"]/1000)%(60))}</div>
  `;
  playBtn.style.zIndex = "999999";

  // https://mp.weixin.qq.com/mp/videoplayer?action=get_mp_video_play_url&preview=1&__biz=MzA5MTA2MzMzMg==&mid=100020584&idx=1&vid=wxv_1975486407473168386&uin=&key=&pass_ticket=&wxtoken=&devicetype=&clientversion=&__biz=MzA5MTA2MzMzMg%3D%3D&appmsg_token=&x5=0&f=json

  console.log("Video SRC: " + urlinfo.url);
  playBtn.href = urlinfo.url;
  playBtn.target = "_blank";
  // playBtn.addEventListener("click", () => {
  //   //
  //   let anchor = 
  //   document.location.href = el.style.backgroundImage;
  // });
  return playBtn;
}

function getVideoUrls(videoId) {
  // https://mp.weixin.qq.com/mp/videoplayer?action=get_mp_video_play_url&preview=1&__biz=MzA5MTA2MzMzMg==&mid=100020584&idx=1&vid=wxv_1975486407473168386&uin=&key=&pass_ticket=&wxtoken=&devicetype=&clientversion=&__biz=MzA5MTA2MzMzMg%3D%3D&appmsg_token=&x5=0&f=json
  let url = `https://mp.weixin.qq.com/mp/videoplayer?action=get_mp_video_play_url&preview=1&__biz=MzA5MTA2MzMzMg==&mid=100020584&idx=1&vid=${videoId}&uin=&key=&pass_ticket=&wxtoken=&devicetype=&clientversion=&__biz=MzA5MTA2MzMzMg%3D%3D&appmsg_token=&x5=0&f=json`;
  return new Promise((resolve, reject) => {
    try {
      let xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      xhr.onload = function () {
        if (xhr.status === 200) {
          let data = JSON.parse(xhr.responseText);
          // console.log("getVideoUrls DATA: ");
          // console.log(data);
          let list = data["url_info"]|| [];
          // console.log("getVideoUrls url list: ");
          // console.log(list);
          resolve(list);
        } else {
          reject("wx failed!");
        }
      }
      xhr.send();
    } catch (e) {
      reject(e);
    }
  });
}

function isNormalVideo(vInfo) {
  if (vInfo.multi_item[0].status === 3 && vInfo.multi_item[0].ext_status === 0) {
    return true;
  } else {
    return false;
  }
}
function getVideoStatus(vInfo) {
  if (vInfo.v.is_new_video || vInfo.v.multi_item[0].is_new_video) {
    if (vInfo.v.multi_item[0].status === 0 || vInfo.v.multi_item[0].status === 10) {
      if (vInfo.v.multi_item[0].status === 0) {
        return 1;
      }
      if (vInfo.v.multi_item[0].status === 10) {
        return 2;
      }
      // if (vInfo.v.multi_item[0].ext_status === 1) {
      //   getDescription(3);
      // } else if (vInfo.v.multi_item[0].status === 0) {
      //   getDescription(4);
      // } else if (vInfo.v.multi_item[0].status === 10) {
      //   getDescription(5);
      // }
    } else if (vInfo.v.multi_item[0].status === 1) {
      // getDescription(3);
      return 6;
    } else if (vInfo.v.multi_item[0].status === 2 || vInfo.v.multi_item[0].status === 8) {
      if (vInfo.v.multi_item[0].status === 2) {
        return 7;
      }
      if (vInfo.v.multi_item[0].status === 8) {
        return 8;
      }
      // if (vInfo.v.multi_item[0].mp_video_fail_detail_wording) {
      //   getDescription(vInfo.v.multi_item[0].mp_video_fail_detail_wording);
      // } else if (vInfo.v.multi_item[0].ext_status === 1) {
      //   getDescription(9)
      // } else {
      //   getDescription(3);
      // }
    } else if (vInfo.v.multi_item[0].status === 11 || vInfo.v.multi_item[0].status === 12) {
      // if (vInfo.v.multi_item[0].mp_video_fail_detail_wording) {
      //   getDescription(vInfo.v.multi_item[0].mp_video_fail_detail_wording);
      // }
      return 11;
    } else if (vInfo.v.multi_item[0].status === 6 || vInfo.v.multi_item[0].status === 7) {
      if (vInfo.v.multi_item[0].status === 6) {
        return 12;
      } else if (vInfo.v.multi_item[0].status === 7) {
        return 13;
      }
      // if (vInfo.v.multi_item[0].mp_video_fail_detail_wording) {
      //   getDescription(vInfo.v.multi_item[0].mp_video_fail_detail_wording);
      // } else if (data.video_ori_status === 2) {
      //   getDescription(14);
      // } else if (data.video_ori_status === 3) {
      //   if (oriFailReason === 1) {
      //     getDescription(15);
      //   } else if (oriFailReason === 3) {
      //     getDescription(16);
      //   } else if (oriFailReason === 5) {
      //     getDescription(17);
      //   }
      // } else if (vInfo.v.multi_item[0].ext_status === 1) {
      //   getDescription(3);
      // }
    } else if (vInfo.v.multi_item[0].status === 3) {
      // if (vInfo.v.multi_item[0].ext_status === 1) {
      //   getDescription(3);
      // }
      return 0;
    } else if (vInfo.v.multi_item[0].status === 4) {
      if (vInfo.v.multi_item[0].ext_status === 1) {
        return 18;
      } else {
        return 19;
      }
      // if (vInfo.v.multi_item[0].ext_status === 1) {
      //   getDescription(3);
      // } else {
      //   getDescription(20);
      // }
    } else if (vInfo.v.multi_item[0].status === 5) {
      return 21;
      // if (vInfo.v.multi_item[0].ext_status === 1) {
      //   getDescription(22);
      // } else {
      //   getDescription(23);
      // }
    } else if (vInfo.v.multi_item[0].status === 9) {
      if (vInfo.v.multi_item[0].mp_video_fail_detail_wording) {
        return 11;
        // getDescription(vInfo.v.multi_item[0].mp_video_fail_detail_wording);
      }
    }
  } else {
    return 24;
  }
}
function getDescription(code) {
  let codes = {
    0: "已通过",
    1: "审核中",
    2: "修改审核中",
    3: "视频标题或介绍可能包含违反平台规范的内容，保存失败。",
    4: "预计1个小时内完成审核，审核通过的视频素材才可以被使用。",
    5: "预计1个小时内完成审核，审核通过后，修改内容在重新群发后生效。",
    6: "资料不完整",
    7: "审核失败",
    8: "修改审核失败",
    9: "{{data.fail_reason}}如有异议，可查询 <a href='http://kf.qq.com/faq/120911VrYVrA150804IjEfyu.html' target='_blank' rel='noopener norefferrer'>FAQ</a>",
    10: "视频标题或介绍可能包含违反平台规范的内容，保存失败。",
    11: "已下架",
    12: "原创声明失败",
    13: "原创校验失败",
    14: "经识别，视频被{{data.hit_nickname}}声明原创，如有异议可 <a :href=\'complainUrl\'>申诉</a>",
    15: "该视频时长不足1分钟，暂时不能申请原创视频。",
    16: "经识别，视频转载自其他视频平台，不能申请原创视频。",
    17: "该视频的清晰度或音频等质量过低，不能申请原创视频。",
    18: "审核不通过",
    19: "转码中",
    20: "转码成可播放格式，预计几分钟内完成，然后进入审核阶段。",
    21: "转码失败",
    22: "转码失败，请删除本素材，重新创建新的视频素材，如有疑问，可查询 <a href='http://kf.qq.com/faq/120911VrYVrA150804IjEfyu.html' target='_blank' rel='noopener norefferrer'>FAQ</a>",
    23: "视频文件可能存在问题或格式不够标准，转码失败，请检查后重新上传。",
    24: "-"
  };
  return codes[code];
}
function fetchVideoListAsync (page) {
  let begin = (page - 1) * 10;
  // https://mp.weixin.qq.com/cgi-bin/appmsg?action=list_video&t=media/video_list&type=15&begin=1&count=10&token=1002863968&lang=zh_CN&f=json&ajax=1
  let url = `https://mp.weixin.qq.com/cgi-bin/appmsg?action=list_video&t=media/video_list&type=15&begin=${begin}&count=10&token=${token}&lang=zh_CN&f=json&ajax=1`;
  return new Promise((resolve, reject) => {
    try {
      let xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      xhr.onload = function () {
        if (xhr.status === 200) {
          let data = JSON.parse(xhr.responseText);
          let list = data["app_msg_info"]["item"] || [];
          let vidCount = data["app_msg_info"]["file_cnt"]["video_msg_cnt"];
          totalPage = Math.ceil(vidCount / 10);

          allVideoList = allVideoList.concat(list);

          list = list.filter(v => !isNormalVideo(v));
          list = list.map(v => {
            return {
              title: v.title,
              page: page,
              v: v
            };
          });
          resolve(list);
        } else {
          reject("wx failed!");
        }
      }
      xhr.send();
    } catch (e) {
      reject(e);
    }
  });
}

function getParentTr(el) {
  for(var i = 0; i < 10; i++) {
    if (el.parentElement && el.parentElement.className.includes("weui-desktop-simple-video__name-td")) {
      el = el.parentElement;
      return el;
    }
  }
  return el;
}

function getThumbnailUrls() {
  document.querySelectorAll(".weui-desktop-simple-video__thumb")
    .forEach((el, i) => {
      if (el.style.backgroundImage) {
        let downloadBtn = document.createElement("a");
        downloadBtn.style.height = "30px";
        downloadBtn.style.width = "30px";
        downloadBtn.style.fontWeight = "bold";
        downloadBtn.style.display = "flex";
        downloadBtn.style.justifyContent = "center";
        downloadBtn.style.alignItems = "center";
        downloadBtn.style.background = "#00000080";
        downloadBtn.style.color = "#ffffff";
        downloadBtn.innerText = ">";
        downloadBtn.style.transform = "rotate(90deg)";
        downloadBtn.style.position = "absolute";
        downloadBtn.style.top = 0;
        downloadBtn.style.left = "0";
        downloadBtn.style.zIndex = "999999";
        let bg = el.style.backgroundImage;
        bg = bg.replace("url(\"", "");
        bg = bg.replace("\")", "");
        downloadBtn.href = bg;
        downloadBtn.target = "_blank";
        getParentTr(el).appendChild(downloadBtn);

      }
    });
}
/**
 * Fetch Video List By Page
 * @param {*} page 
 */
function fetchVoiceList (page) {
  let begin = (page - 1) * 10;
  // https://mp.weixin.qq.com/cgi-bin/appmsg?action=list_video&t=media/video_list&type=15&begin=1&count=10&token=1002863968&lang=zh_CN&f=json&ajax=1
  let url = `https://mp.weixin.qq.com/cgi-bin/filepage?type=3&begin=${begin}&count=20&token=${token}&lang=zh_CN&f=json&ajax=1`;
  let xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.onload = function () {
    if (xhr.status === 200) {
      let data = JSON.parse(xhr.responseText);
      let list = data["page_info"]["file_item"];
      let timeOut = setTimeout(() => {
        document.querySelector(".weui-desktop-media__list.weui-desktop-media__gap-wrp").querySelectorAll(".weui-desktop-media__list-col").forEach((el, index) => {
          let audioDiv = document.createElement("div");
          audioDiv.style.backgroundColor = "#fff";
          audioDiv.style.textAlign = "center";
          audioDiv.innerHTML = "(" + list[index].title + ")<br>" + list[index]["voice_encode_fileid"];
          el.querySelector(".weui-desktop-audio-card").appendChild(audioDiv);
        });
        clearTimeout(timeOut);
      }, 2500);
    } else {
      // err
    }
  }
  xhr.send();
}
async function fetchUnderreviewVideoList(tmpPage = 1) {
  let tmpList = [];
  // for get page count, so dont save it!
  await fetchVideoListAsync(tmpPage);

  if (tmpPage < totalPage) {
    tmpList = await fetchVideoListAsync(tmpPage);
    underReviewVideoList = underReviewVideoList.concat(tmpList);
    tmpPage++;
    fetchUnderreviewVideoList(tmpPage);
    pushVideoDom(tmpList);
  } else {
    saveToLocalStorage(JSON.stringify(allVideoList));
  }
}
function pushVideoDom(list) {
  if (!document.getElementById("kristalMpDialogIcon")) {
    let mpDialogIcon = document.createElement("div");
    mpDialogIcon.id = "kristalMpDialogIcon";
    mpDialogIcon.style.width = "25px";
    mpDialogIcon.style.height = "25px";
    mpDialogIcon.style.position = "fixed";
    mpDialogIcon.style.top = "160px";
    mpDialogIcon.style.right = "0";
    mpDialogIcon.style.border = "1px solid #dedede";
    mpDialogIcon.style.display = "flex";
    mpDialogIcon.style.justifyContent = "center";
    mpDialogIcon.style.alignItems = "center";
    mpDialogIcon.style.boxShadow = "0 0 15px #00000030";
    mpDialogIcon.style.zIndex = "999999999999";
    mpDialogIcon.style.userSelect = "none";
    mpDialogIcon.style.cursor = "pointer";
    mpDialogIcon.innerText = "<>";
    if (underReviewVideoList && underReviewVideoList.length) {
      mpDialogIcon.style.background = "#ff0000";
      mpDialogIcon.style.color = "#ffffff";
    } else {
      mpDialogIcon.style.background = "#ffffff";
      mpDialogIcon.style.color = "#585858";
    }
    mpDialogIcon.addEventListener("click", () => {
      let mpDialog = document.getElementById("kristalMpDialog");
      if (mpDialog.className === "kristal-dialog close") {
        mpDialog.style.width = "600px";
        mpDialog.style.height = "600px";
        mpDialog.style.overflowY = "auto";
        mpDialog.className = "kristal-dialog open";
        mpDialog.style.border = "1px solid #dedede";
        mpDialog.style.padding = "15px";
        mpDialog.style.boxShadow = "0 0 15px #00000030";
        mpDialogIcon.innerText = "X";
      } else {
        mpDialog.style.width = "0px";
        mpDialog.style.height = "0px";
        mpDialog.style.overflowY = "hidden";
        mpDialog.className = "kristal-dialog close";
        mpDialog.style.border = "none";
        mpDialog.style.padding = "0";
        mpDialog.style.boxShadow = "none";
        mpDialogIcon.innerText = "<>";
      }
    });
    if (document.getElementById("header")) {
      document.getElementById("header").appendChild(mpDialogIcon);
    }
    
  } else {
    let mpDialogIcon = document.getElementById("kristalMpDialogIcon");
    if (underReviewVideoList && underReviewVideoList.length) {
      mpDialogIcon.style.background = "#ff0000";
      mpDialogIcon.style.color = "#ffffff";
    } else {
      mpDialogIcon.style.background = "#ffffff";
      mpDialogIcon.style.color = "#585858";
    }
  }
  if (!document.getElementById("kristalMpDialog")) {
    let mpDialog = document.createElement("div");
    mpDialog.id = "kristalMpDialog";
    mpDialog.className = "kristal-dialog close";
    mpDialog.style.width = "0px";
    mpDialog.style.height = "0px";
    mpDialog.style.overflow = "hidden";
    mpDialog.style.position = "fixed";
    mpDialog.style.top = "200px";
    mpDialog.style.right = "0";
    mpDialog.style.background = "#ffffff";
    mpDialog.style.zIndex = "999999999999";
    if (document.getElementById("header")) {
      document.getElementById("header").appendChild(mpDialog);
    }
    
  }
  if (list && list.length) {
    list.forEach(v => {
      let domItem = document.createElement("div");
      domItem.style.border = "1px solid #dedede";
      domItem.style.display = "flex";
      domItem.style.flexFlow = "row wrap";
      domItem.style.padding = "5px 15px";
      domItem.innerText = v.title + ", page: " + v.page + ", count: " + list.length + ", status: " + getDescription(getVideoStatus(v));
      document.getElementById("kristalMpDialog").appendChild(domItem);
    });
  }
} // 1, 2, 845
window.onload = function () {
  let isMpPages = window.location.href.includes("https://mp.weixin.qq.com/cgi-bin/");
  let isMpArticle = false;
  if (window.location.href.includes("https://mp.weixin.qq.com/")) {
    isMpArticle = !isMpPages;
  }

  if (isMpArticle) {
    let url = window.location.href;
    url = url.replace("#rd", "&f=json");
    url = url + "&f=json";
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        // document.getElementById("res").innerHTML = this.responseText;
        let articleInfo = {
          author: JSON.parse(this.responseText).author,
          cdn_url: JSON.parse(this.responseText).cdn_url,
          create_time: JSON.parse(this.responseText).create_time,
          desc: JSON.parse(this.responseText).desc,
          hd_head_img: JSON.parse(this.responseText).hd_head_img,
          nick_name: JSON.parse(this.responseText).nick_name,
          title: JSON.parse(this.responseText).title,
          video_ids: JSON.parse(this.responseText).video_ids,
          video_page_infos: JSON.parse(this.responseText).video_page_infos,
          signature: JSON.parse(this.responseText).signature,
        };
        // console.log(JSON.parse(this.responseText));
        // console.log(articleInfo);
        let card = document.createElement("div");
        card.style.padding = "15px";
        card.style.position = "fixed";
        card.style.top = "50px";
        card.style.left = "20px";
        card.style.boxShadow = "0 0 15px #00000050";
        card.style.borderRadius = "7px";
        Object.keys(articleInfo).forEach(key => {
          let cardText = document.createElement("div");
          cardText.innerText = key + ": " + articleInfo[key].toString();
          // cardText.
          card.appendChild(cardText);
        });
        document.body.appendChild(card);
      }
    };
    xhr.open("GET", url, true);
    xhr.send();
  }

  if (isMpPages) {
    isMaterialPage = true;
    let urlParams = new URLSearchParams(window.location.search);
    token = urlParams.get("token");
    query = urlParams.get("query");
    if (urlParams.get("type") == 15)
    {
      isVideoMaterialPage = true;
      if (urlParams.get("query")) {
        isVideoMaterialPageSearch = true;
      }
    } else {
      isVideoMaterialPage = false;
    }
    if (urlParams.get("type") == 3)
    {
      isAudioMaterialPage = true;
    } else {
      isAudioMaterialPage = false;
    }
  }
  let wxPagitation = document.querySelector(".weui-desktop-pagination__num__wrp");
  if (wxPagitation) {
    page = Number(wxPagitation.firstChild.innerText);
    totalPage = Number(wxPagitation.lastChild.innerText);
  }
  
  if (isVideoMaterialPage) {
    if (isVideoMaterialPageSearch) {
      searchVideoList(page);
    } else {
      fetchVideoList(page);
    }
    fetchUnderreviewVideoList();
    getThumbnailUrls();
  }
  if (isAudioMaterialPage) {
    fetchVoiceList(page);
  }

  if (isMpPages) {
    document.addEventListener("click", function () {
      let pageVal = document.querySelector(".weui-desktop-pagination__input").value;
      let paginationTimeOut = setTimeout(() => {
        if (Number(pageVal) !== page) {
          page = Number(pageVal);
          if (isVideoMaterialPage) {
            if (isVideoMaterialPageSearch) {
              searchVideoList(page);
            } else {
              fetchVideoList(page);
              getThumbnailUrls();
            }
          }
          if (isAudioMaterialPage) {
            fetchVoiceList(page);
          }
        }
        clearTimeout(paginationTimeOut);
      }, 2500);
    });
  }

  let isYoutube = window.location.href.includes("https://www.youtube.com/");
  let letYoutube = true;
  if (isYoutube && letYoutube) {
    var myYoutubeCaptionDiv = document.createElement("div");
    myYoutubeCaptionDiv.id = "kristalCaption";
    myYoutubeCaptionDiv.style.position = "relative";
    myYoutubeCaptionDiv.style.fontFamily = "KazNet";
    myYoutubeCaptionDiv.style.textAlign = "center";
    myYoutubeCaptionDiv.style.fontSize = "24px";
    myYoutubeCaptionDiv.style.padding = "0px";
    myYoutubeCaptionDiv.style.top = "-100px";
    myYoutubeCaptionDiv.style.backgroundColor = "#00000099";
    myYoutubeCaptionDiv.style.color = "#ffffff";
    myYoutubeCaptionDiv.style.height = "0px";
    myYoutubeCaptionDiv.style.overflow = "hidden";
    let ytCaptionCreateTimeout = setTimeout(() => {
      document.querySelector("#ytd-player").appendChild(myYoutubeCaptionDiv);  
      clearTimeout(ytCaptionCreateTimeout);
    }, 3000);
  }
};



// window.ononline = function (e) {
//   console.log(e);
// }

// window.onoffline = function (e) {
//   console.log(e);
// }