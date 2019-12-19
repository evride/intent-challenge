(function(window){
	const $d = window.document;
	const $b = $d.body;
	const $html = $d.querySelector('html');



	function InspireModule(){
		this.clicks = 0;
		this.overlayOpen = false;

		this.overlayContainer = null;
		this.openButton = null;

		this.scrollPos = {
			hTop: 0,
			hLeft: 0,
			bTop: 0,
			bLeft: 0,
			bmTop: 0,
			bmLeft: 0
		}
		this.prefix = "inspire" + new Date().getTime();
		this.bindListeners();
		this.loadStylesheet();
	}

	var p = InspireModule.prototype;
	p.bindListeners = function(){
		this.onButtonClicked = this._onButtonClicked.bind(this);
		this.closeInspireOverlay = this._closeInspireOverlay.bind(this);
	}
	p.init = function(){
		this.openButton  = this.createInspireButton();
		$b.appendChild(this.openButton);
		this.openButton.addEventListener('click', this.onButtonClicked);
	}
	p.createInspireButton = function(){
		let btn = $d.createElement('button');
		btn.className = this.transformClass("inspire-btn");
		btn.innerText = "0";
		return btn;

	}
	p.loadStylesheet = function(){
		var that = this;
		var req = new XMLHttpRequest();
		req.addEventListener("load", function(evt){
			let styles = String(evt.currentTarget.responseText).replace(/inspire/g, that.prefix);

			let css = $d.createElement('style');
			css.type = 'text/css'; 
		
	        if (css.styleSheet) {
	            css.styleSheet.cssText = styles; 
	        }else{
	            css.appendChild(document.createTextNode(styles)); 
	        }
			$d.querySelector('head').appendChild(css);
			that.init();
		});
		req.open("GET", "inspire.css");
		req.send();
	}
	p.createOverlay = function(){
		let overlay = $d.createElement('div');
		let iframe = $d.createElement('iframe');
		let closeBtn = $d.createElement('button');

		closeBtn.innerText = "X";
		closeBtn.className = this.transformClass("inspire-close-btn");
		overlay.className = this.transformClass('inspire-overlay');

		closeBtn.addEventListener('click', this.closeInspireOverlay);

		iframe.src = "iframe.html";
		overlay.appendChild(closeBtn);
		overlay.appendChild(iframe);
		$b.appendChild(overlay);

		this.overlayContainer = overlay;
	}
	p.transformClass = function(str){
		return String(str).replace('inspire', this.prefix);
	}
	p.saveScroll = function(){
		let compStyles = window.getComputedStyle($b);
		this.scrollPos.hTop = $html.scrollTop;
		this.scrollPos.hLeft = $html.scrollLeft;
		this.scrollPos.bTop = $b.scrollTop;
		this.scrollPos.bLeft = $b.scrollLeft;
		this.scrollPos.bmTop = parseInt(compStyles.marginTop);
		this.scrollPos.bmLeft = parseInt(compStyles.marginLeft);
	}
	p.setScroll = function(){
		$html.scrollTop = 0;
		$html.scrollLeft = 0;
		$b.scrollTop = this.scrollPos.hTop + this.scrollPos.bTop + this.scrollPos.bmTop;
		$b.scrollLeft = this.scrollPos.hLeft + this.scrollPos.bLeft + this.scrollPos.bmLeft;
	}
	p.resetScroll = function(){
		$html.scrollTop = this.scrollPos.hTop;
		$html.scrollLeft = this.scrollPos.hLeft;
		$b.scrollTop = this.scrollPos.bTop;
		$b.scrollLeft = this.scrollPos.bLeft;
	}
	p._onButtonClicked = function(evt){
		this.clicks++;
		this.saveScroll();
		$html.classList.add(this.transformClass('inspire-overlay-active'))
		this.createOverlay();
		this.setScroll();
	}
	p._closeInspireOverlay = function(evt){
		this.openButton.innerText = this.clicks;
		if(this.overlayContainer && this.overlayContainer.parentElement){
			this.overlayContainer.parentElement.removeChild(this.overlayContainer);
			this.overlayContainer = null;
		}
		$html.classList.remove(this.transformClass('inspire-overlay-active'))
		this.resetScroll();
	}

	var inspire;
	$d.addEventListener('DOMContentLoaded', function(){
		inspire = new InspireModule();
	});
})(window);