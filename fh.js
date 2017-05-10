/*
	Common and useful functions
	@author nadeermadampat@gmail.com
	@release 10/01/2015
	
*/

var N = {
	api_url : 'http://10.66.228.153/project/api/',
	//api_url : 'http://ncloudhost.com/api/',
	version :  1.3,
	app_name : 'App Name',
	debug : true,
	ERR : {
		NET : {
			GENERIC : 'Please check your internet connection.',
			UNEXPECTED : 'An unexpected error occurred.',
		},
		DATA : {
			LOADING: 'We\'re loading up for you.',
		},
		SESSION : {
			INVALID : 'Invalid session. Please try again.',
		}

	},

	
	alert : function(m){

		navigator.notification.alert(m, null, this.app_name + ' - Message');
	},
	

	info : function(msg, delay, callback)
	{
		var delay = (delay && delay > 0) ? delay : 3500;
		setTimeout(function(){$.mobile.loading('show', { text: (msg || 'ERROR'), textonly: true, textVisible: true, theme:'b' })}, 1); 
		setTimeout(function(){ $.mobile.loading('hide');
			if(callback && typeof callback == "function")  callback();
		}, delay);
	},

	confirm : function(message)
	{
		cnf =  window.confirm(message);
		return cnf;
	},

	
	_p : {val:false, match:false, deafult:false, min:false, max:false},
	setVar : function (_p) {
	var rs = false;
	if(_p.val) rs = _p.val;

	if(rs)
	{
		if(_p.match)
		{
			switch(_p.match)
			{
				case '@email':
					var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
					rs = (re.test(rs)) ? rs : false;
					break;

				case '@number':
					rs = parseFloat(rs);
					rs = (typeof rs == 'number') ? rs : false;
					break;

				case '@string':
					rs = rs; // not necessary; just to understand
					// FIX HERE @todo
					//(isNaN(rs)) ? rs : false;
					break;

				case '@date':
					
					dt_spl = rs.split('-');
					if(dt_spl.length == 3 &&  dt_spl[0].length == 4 &&  dt_spl[1].length == 2 && dt_spl[2].length == 2)
					{
						var dt = new Date(rs);
						if(typeof dt.getDate != 'function' && typeof dt.getDate() == 'number')
						rs = false;
					}
					else rs = false;
					break;

				case '@mobile':
					//// Indian standard mobile pattern
					///  9987724488 ^ 09987724488 ^ +919987724488 ^ 0919987724488 are valid numbers
					var re = /^([0|\+[0-9]{1,3})?([7-9][0-9]{9})$/;
					rs = (re.test(rs)) ? rs : false;
					break;

			}
		}

		if(_p.min)
		{
			if(typeof rs == 'number' && rs < _p.min) rs = false;
			else if (rs.length < _p.min) rs = false;
		}

		if(_p.max)
		{
			if(typeof rs == 'number' && rs > _p.max) rs = false;
			else if (rs.length > _p.max) rs = false;
		}

	}
	else if(_p.default)
	{
		if(!rs) rs = _p.default;
	}

	
	return rs;
	},


	setLocal : function(o)
	{
		Object.keys(o).forEach(function (key) {
			window.localStorage.setItem(key, o[key]);
		});
	},
	

	getLocal : function (key)
	{
		var fetch = window.localStorage.getItem(key);
		if(fetch) return fetch;
		else return false;
	},

	rmLocal : function (k)
	{
		if(typeof k === 'object')
		{
			Object.keys(k).forEach(function (key) {
				window.localStorage.removeItem(k[key]);
			});
		}
		else window.localStorage.removeItem(k);
	},



	_get : function (param)
	{
		var params = window.location.search.substr(1);
		params = params != null && params != "" ? this.transformToAssocArray(params) : '';
		if(params[param]) return params[param];
		else return false;
	},



	transformToAssocArray : function ( prmstr ) {
		var params = {};
		var prmarr = prmstr.split("&");
		for ( var i = 0; i < prmarr.length; i++) {
			var tmparr = prmarr[i].split("=");
			params[tmparr[0]] = tmparr[1];
		}
		return params;
	},
	


	logout : function (holdRedirect) {

		if(!holdRedirect)
		{
			navigator.notification.confirm('Are you sure to logout ?', (function(idx){
				if(idx === 1)
				{
					localStorage.clear();
					fh.changePage('login.html');
				}
			}), this.app_name + ' - Confirm', ['Logout', 'Cancel']);
		}
		else
		{
			localStorage.clear();
			fh.changePage('login.html');
		}

	},
	


	curPageName : function(name)
	{
		var url = location.href;
		var filename =  location.pathname.replace(/^.*[\\\/]/, '');
		if(name)
		{
			if(url.indexOf(name) >= 0) return true;
			else return false;
		}
		else
		{
			return filename;
		}
	},


	changePage : function (pageURL) {
		
		$.mobile.changePage( pageURL, { transition: "fade", changeHash: true });
	},
	


	loader : function (hideLoader, statusTxt)
	{

		if(hideLoader)
		{
			$.mobile.loading('hide');
		}
		else
		{
			if(statusTxt)
			{
				$.mobile.loading( "show", {
					text: statusTxt,
					textVisible: true,
					theme:'b',
				});

			}
			else $.mobile.loading('show');
		}

	},
	

	auth : function(holdRedirect)
	{
		var logged = false;
		if(!this.getLocal('uid') || !this.getLocal('email'))
		{
			log('Auth forcing logout from - ' + fh.curPageName());
			if(holdRedirect) this.logout(true);
			else this.logout();
		}
		else var logged = true;
		////
		return logged;
	},

	setSessionAuth : function(_p, token)
	{
		if(_p && token)
		{
			var token_param = _p + '_token';
			var time_param = _p  + '_token_time';
			_o = {};
			_o[token_param] = token;
			_o[time_param] = new Date();
			fh.setLocal(_o);
		}
		else return false;

	},

	getSessionAuth : function(_p, token)
	{
		if(_p && token)
		{
			var token_param = _p + '_token';
			var time_param = _p  + '_token_time';
			var req_token = fh.getLocal(token_param);
			var req_time = (fh.getLocal(time_param)) ? new Date(fh.getLocal(time_param)) : false;
			var cur_time = new Date();
			var diff = Math.abs(cur_time - req_time);
			var diff_min = Math.floor((diff/1000)/60);
			log('Diff min : ' + diff_min);
			if(req_token && req_time  && req_token == token && diff_min <= 1)
			return true;
			else return false;
		}
		else return false;

	},
	


	wait : function (ms)
	{
		var start = new Date().getTime();
		var end = start;
		while(end < start + ms) {
			end = new Date().getTime();
		}
	},
	


	exit : function()
	{
		navigator.notification.confirm('Are sure to exit the application ?', (function(idx){
			if(idx === 1) navigator.app.exitApp();
		}), this.app_name + ' - Confirm', ['Exit', 'Cancel']);

	},



	randString : function(len)
	{
		var text = "";
		var len = len || 5;
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		for( var i=0; i < len; i++ )
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		////
		return text;
	},

	authKey : function(encode)
	{
		var _k = fh.randString(4);
		var _rks = ['272a','7fcf','b3a3','b416','99df','f371','YZab'];
		var _rk = _rks[Math.floor(Math.random() * (6 - 0) + 0)];
		var uid = fh.getLocal('uid') || 0;
		var _key = fh.randString(4) + '-' + _rk + '-' +  _k + '-' + fh.randString(4) + '-' + uid + '-' + _k + '-' + fh.randString(4) + '-' + fh.randString(4)+ '-' + fh.randString(10);
		//console.log(_key);
		if(encode) return bsp.strenc(_key);
		return _key;
	},

	toTitleCase : function(str)
	{
		if(str && isNaN(str))
			return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
		return false;
	},


};


Array.prototype.inArray = function(comparer) {
	for(var i=0; i < this.length; i++) {
		if(comparer(this[i])) return true;
	}
	return false;
};

Array.prototype.pushIfNotExist = function(element, comparer) {
	if (!this.inArray(comparer)) {
		this.push(element);
	}
};


Array.prototype.cleanPush = function(elem, key) {
	for(var i=0; i < this.length; i++) {
		if(typeof this[i]['qid'] != 'undefined' && this[i]['qid'] == key)
		{
			this.splice(i, 1);
		}
	}
	this.push(elem);  
};





