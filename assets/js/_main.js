/* ==========================================================================
   jQuery plugin settings and other scripts
   ========================================================================== */

$(document).ready(function(){
  // Sticky footer
  var bumpIt = function() {
      $("body").css("margin-bottom", $(".page__footer").outerHeight(true));
    },
    didResize = false;

  bumpIt();

  $(window).resize(function() {
    didResize = true;
  });
  setInterval(function() {
    if (didResize) {
      didResize = false;
      bumpIt();
    }
  }, 250);
  // FitVids init
  $("#main").fitVids();

  // init sticky sidebar
  $(".sticky").Stickyfill();

  var stickySideBar = function(){
    const MINIMUM_WIDTH = 1024;

    // Adjust if the follow button is shown based upon screen size
    var width = $(window).width();
    var show = $(".author__urls-wrapper button").length === 0 ? width > MINIMUM_WIDTH : !$(".author__urls-wrapper button").is(":visible");

    // Don't show the follow button if there is no content for it
    var count = $('.author__urls.social-icons li').length - $('li[class="author__desktop"]').length;
    if (width <= MINIMUM_WIDTH && count === 0) {
      $(".author__urls-wrapper button").hide();
      show = false;
    }

    if (show) {
      // fix
      Stickyfill.rebuild();
      Stickyfill.init();
      $(".author__urls").show();
    } else {
      // unfix
      Stickyfill.stop();
      $(".author__urls").hide();
    }
    $(".author__urls-wrapper button").attr("aria-expanded", String(show)).removeClass("open");
  };

  stickySideBar();

  $(window).resize(function(){
    stickySideBar();
  });

  // Follow menu drop down
  $(".author__urls-wrapper button").on("click", function() {
    var button = $(this);
    var opening = !$(".author__urls").is(":visible");
    $(".author__urls").stop(true, true).toggle(opening);
    button.toggleClass("open", opening).attr("aria-expanded", String(opening));
  });

  var closeAuthorLinks = function() {
    var button = $(".author__urls-wrapper button");
    if (button.is(":visible")) {
      $(".author__urls").hide();
      button.removeClass("open").attr("aria-expanded", "false");
    }
  };

  $(".author__urls-wrapper").on("keydown", function(event) {
    if (event.key === "Escape") {
      closeAuthorLinks();
      $(".author__urls-wrapper button:visible").trigger("focus");
    }
  });

  $(document).on("click", function(event) {
    if (!$(event.target).closest(".author__urls-wrapper").length) {
      closeAuthorLinks();
    }
  });

  // init smooth scroll, this needs to be slightly more than then fixed masthead height
  $("a").smoothScroll({offset: -65});

  // add lightbox class to all image links
  $("a[href$='.jpg'],a[href$='.jpeg'],a[href$='.JPG'],a[href$='.png'],a[href$='.gif']").addClass("image-popup");

  // Magnific-Popup options
  $(".image-popup").magnificPopup({
    type: 'image',
    tLoading: 'Loading image #%curr%...',
    gallery: {
      enabled: true,
      navigateByImgClick: true,
      preload: [0,1] // Will preload 0 - before current, and 1 after the current image
    },
    image: {
      tError: '<a href="%url%">Image #%curr%</a> could not be loaded.',
    },
    removalDelay: 500, // Delay in milliseconds before popup is removed
    // Class that is added to body when popup is open.
    // make it unique to apply your CSS animations just to this exact popup
    mainClass: 'mfp-zoom-in',
    callbacks: {
      beforeOpen: function() {
        // just a hack that adds mfp-anim class to markup
        this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim');
      }
    },
    closeOnContentClick: true,
    midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
  });

});
