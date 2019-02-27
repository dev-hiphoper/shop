$.validator.setDefaults({
	debug:false,//디버깅 용도에만 활성
	errorClass:'err',
	errorElement:'p',
	// onkeyup:false,
	// onfocusout:false,
	// onclick:false,
	errorPlacement:function(error,element){
		error.removeClass('err').addClass('error tc_poi');
		element.removeClass('err');
		var $wraper = element.closest('[class^=input_]');
		if(element.is('#certcheck')){
			$wraper = element.closest('.cert');
		}
		$wraper.find('p.error').remove();
		$wraper.addClass('error').append(error);
		if(element.is('[name^=phone]')){
			element.closest('div.phone').addClass('error');
		}
		if(element.is('[name^=useremail]')){
			element.closest('div.email').addClass('error');
		}
		if(element.is('[name^=bir]')){
			element.closest('div.birthday').addClass('error');
		}
		if(element.is('[name=usersex]')){
			element.closest('div.sex').addClass('error');
		}
	},
	success: function(label,element) {
		var $wraper = $(element).closest('[class^=input_]');
		if($(element).is('#certcheck')){
			$wraper = $(element).closest('.cert');
		}
		label.remove();
		$(element).removeClass('valid');
		$wraper.removeClass('error');
		if($(element).closest('div.phone').hasClass('error') && $(element).closest('div.phone').find('p.error').length == 0){
			$(element).closest('div.phone').removeClass('error');
		}
		if($(element).closest('div.email').hasClass('error') && $(element).closest('div.email').find('p.error').length == 0){
			$(element).closest('div.email').removeClass('error');
		}
		if($(element).closest('div.birthday').hasClass('error') && $(element).closest('div.birthday').find('p.error').length == 0){
			$(element).closest('div.birthday').removeClass('error');
		}
		if($(element).closest('div.sex').hasClass('error') && $(element).closest('div.sex').find('p.error').length == 0){
			$(element).closest('div.sex').removeClass('error');
		}
	}
});
var likeBtnFn = function(obj){//좋아요버튼
		var $this = obj,
			count = $this.attr('data-count')*1,
			w = $this.width();
		if($this.hasClass('selected')){
			$this.removeClass('selected');
			count--;
		}else{
			$this.addClass('selected');
			count++;
		}
		$this.attr('data-count',count).find('.count').text(numberWithCommas(count));
		if( w!=$this.width() ){
			brandWidthSet($this.closest('li').find('.func'));
		}
		if($this.is('[data-callback]')){
			var cb = $this.attr('data-callback');
			window[cb].call($this[0]);
		}
	},
	numberWithCommas = function(x){
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	},
	resizeFn = function(e){
		$('.list_product:not(.small) .func').each(function(i,el) {
			brandWidthSet(el);
		});
		$('.street_list .func').each(function(i,el) {
			brandWidthSet2(el);
		});
	},
	brandWidthSet = function(el){
		var w = $(el).closest('li').width()-10;
		$(el).closest('li').find('.brand').css('max-width',w-$(el).width());
	},
	brandWidthSet2 = function(el){
		var w = $(el).closest('li').width()-25;
		$(el).closest('li').find('.category').css('max-width',w-$(el).width());
	},
	qnaViewFn = function(obj){
		var $this = $(obj);
		$this.closest('.group').find('.item').removeClass('view');
		$this.closest('.item').addClass('view');
	},
	setNumber = function(type,obj){
		var t = obj.closest('.input_number').find('.text_number'),
			n = t.val()*1;
		if(type == 'plus'){
			t.val(n+1);
		}
		if(type == 'minus' && n>1){
			t.val(n-1);
		}
	},
	numberMaxlength = function(obj){
		if (obj.value.length > obj.maxLength){
			obj.value = obj.value.slice(0, obj.maxLength);
		}
	},
	openLayer = function(event,obj,focus){
		var checkObject = typeof obj == 'object',
			$tar = checkObject?$($(obj).attr('href')):$(obj),
			$tar = $tar.closest('.dim_layer').is('div:not(.alert)')?$tar.closest('.dim_layer'):$tar;
			$focus = checkObject?$(obj):$(focus),
			closeID = $tar.hasClass('dim_layer')?$tar.find('.wrap_layer').attr('id'):$tar.attr('id'),
			evt = event;
		if(checkObject && $(obj).is('a')){
			evt.preventDefault();
		}
		$tar.data('focus',$focus);
		$('body').css('overflow','hidden');
		if($tar.hasClass('alert_layer')){
			if(event){
				$tar.find('.btn_cancel').on('click',function(e){
					$tar.data('off',$(this));
					closeLayer('#'+closeID);
				});
			}
			$tar.removeClass('hide').find('.btn_confirm').focus();
		}else{
			$tar.removeClass('hide').find('.btn_close').on('click',function(e){
				$tar.data('off',$(this));
				closeLayer('#'+closeID);
			}).focus();
			function layerResize(){
				var a = $tar.find('.wrap_layer').outerHeight()+100,
					b = $(window).height();
				if( a>b ){
					$tar.addClass('scroll');
				}else{
					$tar.removeClass('scroll');
				}
			}
			if($tar.is('.dim_layer:not(.search_layer)')){
				layerResize();
				$(window).on('resize.dimLayer',layerResize);
			}
		};
	},
	closeLayer = function(tar){
		var $tar = $(tar).closest('.dim_layer').is('div')?$(tar).closest('.dim_layer'):$(tar);
		$tar.addClass('hide');
		if($tar.data('off')){
			$tar.data('off').off('click');
		};
		if($tar.data('focus')){
			$tar.data('focus').focus();
		};
		if($tar.hasClass('dim_layer')){
			$tar.removeClass('scroll');
			$(window).off('resize.dimLayer');
		}
		if($tar.hasClass('alert')){
			$tar.remove();
		}
		$('body').removeAttr('style');
	},
	showAlert = function(name,message,type,callback){
		var btns = type==0?'<button type="button" class="btn_cancel lc_e5 tc_8">취소</button><button type="button" class="btn_confirm lc_e5">확인</button>':'<button type="button" class="btn_confirm lc_e5">확인</button>',
			code = '<div class="dim_layer alert"><div class="alert_layer lc_b pos_center hide" id="'+name+'"><p class="message tc_3">'+message+'</p><div class="btns lc_e5 clear">'+btns+'</div></div></div>';
		$('body').append(code);
		var $alert = $('#'+name),
			btnCancel = $alert.find('.btn_cancel'),
			btnConfirm = $alert.find('.btn_confirm');
		openLayer(window.event,'#'+name);
		if(callback){
			window[callback].call(null,btnCancel,btnConfirm,'#'+name);
		}else{
			btnCancel.on('click',function(e){
				closeLayer('#'+name);
			});
			btnConfirm.on('click',function(e){
				closeLayer('#'+name);
			});
		}
	},
	validateFn = function(event,obj){
		var $this = $(obj),
			$req = $this.find('[required]'),
			length = $req.length,
			count = 0;
		$this.find('.error:not(p)').removeClass('error');
		$req.each(function(index, el) {
			if(el.checkValidity()){
				if($(el).is('select') || $(el).is('[type=hidden]')){
					if(!$(el).val()){
						showValidate(el);
					}else{
						count++
					}
				}else{
					if($(el).is('[minlength]')){
						if($(el).attr('minlength')*1 > $(el).val().length){
							showValidate(el);
						}
					}else{
						count++;
					}
				}
			}else{
				showValidate(el);
			}
		});
		if(count != length){
			event.preventDefault();
			event.stopPropagation();
		}
	},
	addErr = function(tar){
		var $tar = tar.closest('table').is('.table_st')?tar.closest('td').find('>*').eq(0).is('[class^=input_]')?tar.closest('[class^=input_]'):tar.closest('div'):tar.closest('[class^=input_]');
		$tar.addClass('error');
	},
	showValidate = function(obj){
		if($(obj).is('select')){
			if($(obj).find('option:selected').is('[disabled]')){
				addErr($(obj));
			}
		}
		if($(obj).is('[minlength]')){
			if($(obj).attr('minlength')*1 > $(obj).val().length){
				addErr($(obj));
			}
		}
		$(obj).one('invalid',function(e){
			e.preventDefault();
			addErr($(this));
		});
		obj.reportValidity();
	},
	expandSummary = function(obj){
		if($(obj).closest('.mypage_summary').hasClass('mini')){
			$(obj).closest('.mypage_summary').removeClass('mini')
		}else{
			$(obj).closest('.mypage_summary').addClass('mini')
		}
	};
$(window).on({
	click:function(e){
		var $this = $(e.target);
		if( $this.closest('button').is('[data-type=like]') ){//좋아요버튼
			likeBtnFn($this.closest('button'));
		}
		if( $this.closest('a').hasClass('disabled') ){//a링크 비활성화
			e.preventDefault();
		}
		if( $this.closest('button').is('[data-type=qnaview]') ){//qna 버튼 열기 닫기
			qnaViewFn($this[0]);
		}
		if( $this.closest('button').is('[data-type=inputreset]') ){//input 리셋하기
			$this.closest('button').prev('input').val('');
		}
		if( $this.closest('a').is('[data-type=thumbnail]') ){//상품 상세 이미지
			e.preventDefault();
			$this.closest('a').closest('.thumbnails').find('.active').removeClass('active');
			$('img[data-type="visual"]').attr('src',$this.closest('a').attr('href'));
			$this.closest('a').addClass('active');
		}
		if( $this.is('[data-type=plus]') ){//input 숫자 더하기
			setNumber('plus',$this);
		}
		if( $this.is('[data-type=minus]') ){//input 숫자 빼기
			setNumber('minus',$this);
		}
		if( $this.is('a[data-type=tooltip]') ){//툴팁
			e.preventDefault();
			var $tar = $($this.attr('href'));
			if($tar.hasClass('hide')){//툴팁 보이기
				$tar.removeClass('hide').on('mouseleave',function(e){//툴팁 가리기
					$tar.addClass('hide').off('mouseleave');
				});
			}else{//툴팁 가리기
				$tar.addClass('hide');
			}
		}else{
			$('.tootip_layer').addClass('hide');
		}
		if( $this.is('button[data-type=copyButton]') ){//카피버튼
			var tar = $('input[data-type=copyTarget]');
			tar.select();
			var successful = document.execCommand('copy');
			if(successful){
				showAlert('copyResult','주소가 복사 되었습니다.',1);
			}else{
				showAlert('copyResult','주소 복사에 실패했습니다.',1);
			}
		}
	},
	change:function(e){
		var $this = $(e.target);
		if( $this.is('select.tc_3_h') ){//셀렉트 박스 컬러 변경
			$this.addClass('tc_3');
		}
		if( $this.is('input[data-type=checkAll]') ){//테이블 체크박스 전체 선택
			var checkboxs = $this.closest('table').find('tbody input[type=checkbox]:not([disabled])');
			checkboxs.each(function(e){
				$(this).prop('checked',$this.prop('checked'))
			})
		}
		if( $this.is('select[data-type=changeEmail]') ){//이메일 바꾸기
			var input = $('input[data-type=inputEmail]');
			input.prop('value',$this.val());
			input.focus();
			if($this[0].selectedIndex != 1){
				$this.focus();
			}
		}
		if( $this.is('input[type=checkbox][data-type=joinCheckAll]') ){//회원가입 약관 전체체크
			var check = $('input[type=checkbox][data-type=joinCheck]');
			check.prop('checked',$this.prop('checked'))
		}
		if( $this.is('input[type=checkbox][data-type=joinCheck]') ){//회원가입 약관 체크시 전체약관 체크
			var a = $('input[type=checkbox][data-type=joinCheck]').length,
				b = $('input[type=checkbox][data-type=joinCheck]:checked').length,
				all = $('input[type=checkbox][data-type=joinCheckAll]');
			if(a == b){
				all.prop('checked',true)
			}else{
				all.prop('checked',false)
			}
		}
		if( $this.is('[type=file]') && $this.closest('span').is('.input_file') ){//file
			$this.closest('.error').removeClass('error');
			if($this.is('[data-max-size]')){
				var max = $this.attr('data-max-size') * 1;
				if( Math.floor($this[0].files[0].size/1000000) > max ){
					addErr($this);
					$this.val('');
					return false;
				}
			}
			var input = $this.prev('.name');
			input.val($this[0].files[0].name);
		}
		if( $this.is('[type=checkbox][required]') ){
			$this.blur().focus();
		}

	},
	mouseenter:function(e){
		var $this = $(e.target);
		if( $this.closest('button').is('[data-type*=qnaview]') ){//qna 버튼 오버 줄표시
			$this.closest('button').prev().addClass('over')
		}
	},
	mouseleave:function(e){
		var $this = $(e.target);
		if( $this.closest('button').is('[data-type*=qnaview]') ){//qna 버튼 오버 줄표시
			$this.closest('button').prev().removeClass('over')
		}
	},
	focusin:function(e){
		var $this = $(e.target);
		if( $this.closest('button').is('[data-type*=qnaview]') ){//qna 버튼 오버 줄표시
			$this.closest('button').prev().addClass('over')
		}
	},
	focusout:function(e){
		var $this = $(e.target);
		if( $this.closest('button').is('[data-type*=qnaview]') ){//qna 버튼 오버 줄표시
			$this.closest('button').prev().removeClass('over')
		}
	},
	keyup:function(e){
		var $this = $(e.target);
		if( $this.is('textarea[data-type=countlength]') ){//textarea 글자수 세기
			var max = $this.attr('maxlength')*1,
				count = $this.val().length;
			$this.closest('div').find('[data-type=showlength]').text(count);
		}
		if( $this.is('[type=number][maxlength]') ){//number maxlength 제한
			numberMaxlength($this[0]);
		}
	},
	keydown:function(e){
		var $this = $(e.target);
		if( $this.is('[type=number][maxlength]') ){//number maxlength 제한
			numberMaxlength($this[0]);
		}
	},
	resize:function(e){
		resizeFn()
	},
	load:function(e){
		resizeFn()
	}
})
$(document).ready(function(){
	if($.browser.msie){$('html').addClass('ie')};
});





















