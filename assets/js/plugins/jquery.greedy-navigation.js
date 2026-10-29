/*
* Greedy Navigation
*
* http://codepen.io/lukejacksonn/pen/PwmwWV
*
*/

var $nav = $('#site-nav');
var $btn = $('#site-nav button');
var $vlinks = $('#site-nav .visible-links');
var $hlinks = $('#site-nav .hidden-links');

function updateNav() {
  // Re-measure the complete list so all links return when the viewport grows.
  $hlinks.children().appendTo($vlinks);
  $btn.addClass('hidden');

  if ($vlinks.width() > $nav.width()) {
    $btn.removeClass('hidden');
    var availableSpace = $nav.width() - $btn.outerWidth() - 30;
    while ($vlinks.width() > availableSpace && $vlinks.children().length > 1) {
      $vlinks.children().last().prependTo($hlinks);
    }
  }

  var hiddenCount = $hlinks.children().length;
  $btn.toggleClass('hidden', hiddenCount === 0).attr('count', hiddenCount);
  if (hiddenCount === 0) {
    closeNav();
  }
  $btn.attr('aria-expanded', String(!$hlinks.hasClass('hidden')));
}

// Window listeners

$(window).resize(function() {
  updateNav();
});

$btn.on('click', function() {
  $hlinks.toggleClass('hidden');
  $(this).toggleClass('close');
  $(this).attr('aria-expanded', String(!$hlinks.hasClass('hidden')));
});

function closeNav() {
  $hlinks.addClass('hidden');
  $btn.removeClass('close').attr('aria-expanded', 'false');
}

$nav.on('keydown', function(event) {
  if(event.key === 'Escape' && !$hlinks.hasClass('hidden')) {
    closeNav();
    $btn.trigger('focus');
  }
});

$(document).on('click', function(event) {
  if(!$(event.target).closest('#site-nav').length) {
    closeNav();
  }
});

updateNav();
