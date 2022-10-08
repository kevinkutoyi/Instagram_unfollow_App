const interval = 3000;

const wait_delay = 3;

const reload_after_unsub = 20;

instagram_following_page = "";

cur_tick = 0;

buttons = null;

btn_idx = 0;

no_subs = false;

infollowing_page = false;

inprofile_page = false;

var readyStateCheckInterval = setInterval(function () {
  if (document.readyState === "complete") {
    cur_tick += interval / 1000;

    DoJob();

    console.log("timer ...");
  }
}, interval);

function DoJob() {
  if (cur_tick < wait_delay) {
    console.log("waiting delay (10s) : " + cur_tick);
    return;
  }

  if (no_subs) {
    if (cur_tick >= 30) {
      console.log("reloading page ...");
      window.location = instagram_following_page;
    }

    return;
  }

  var cur_url = window.location.href;

  if (cur_url.indexOf("instagram.com") == -1) {
    return;
  }

  if (!IsInProfilePage()) {
    return;
  }

  if (!infollowing_page) {
    if (cur_url.indexOf("following") != -1) {
      infollowing_page = true;

      instagram_following_page = cur_url;
    }
  }

  var b = IsDialogOpen();

  if (!b) {
    OpenDialog();

    return;
  } else {
    console.log("dialog is open");
  }

  var c = UnFollow();

  if (c < 1) {
    no_subs = true;
    return;
  }

  console.log("unfollow : " + c);
}

function IsInProfilePage() {
  if (inprofile_page) {
    return true;
  }

  var ar = document.getElementsByTagName("a");

  var hr = "";

  for (var i = 0; i < ar.length; i++) {
    hr = ar[i].getAttribute("href");

    if (hr.indexOf("accounts/edit/") != -1) {
      console.log("In Profile Page !");

      inprofile_page = true;

      return true;
    }
  }

  return false;
}

function IsDialogOpen() {
  var ar = document.querySelector('div[role="dialog"]');

  if (ar) {
    return true;
  }

  return false;
}

function OpenDialog() {
  var ar = document.getElementsByTagName("a");

  if (!ar) {
    return;
  }

  var hr;

  for (var i = 0; i < ar.length; i++) {
    hr = ar[i].getAttribute("href");

    if (!hr) {
      continue;
    }

    if (hr.indexOf("/following/") == -1) {
      continue;
    }

    ar[i].click();

    console.log("opening dialog");

    break;
  }
}

function UnFollow() {
  var ar = document.getElementsByTagName("button");

  if (!ar) {
    return 0;
  }

  var l;

  var c = 0;

  for (var i = 0; i < ar.length; i++) {
    l = ar[i].textContent;

    if (l.indexOf("Following") != -1) {
      ar[i].scrollIntoView();

      ar[i].click();

      c++;

      setInterval(function () {
        SubUnfollow();
      }, 1000);

      return c;
    }
  }

  return c;
}

function SubUnfollow() {
  var ar = document.getElementsByTagName("button");

  if (!ar) {
    return;
  }

  var l;

  for (var i = 0; i < ar.length; i++) {
    l = ar[i].textContent;

    if (!l) {
      continue;
    }

    if (l.indexOf("Unfollow") != -1) {
      ar[i].click();
      return;
    }
  }
}
