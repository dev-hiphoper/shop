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
			$tar = $tar.closest('.dim_layer').is('div')?$tar.closest('.dim_layer'):$tar;
			$focus = checkObject?$(obj):$(focus),
			closeID = $tar.hasClass('dim_layer')?$tar.find('.wrap_layer').attr('id'):$tar.attr('id');
		if(checkObject && $(obj).is('a')){
			event.preventDefault();
		}
		$tar.data('focus',$focus);
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
			if($tar.hasClass('dim_layer')){
				layerResize();
				$(window).on('resize.dimLayer',layerResize);
			}
		}
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
		if( $this.is('a[data-type=tooltip]') ){//툴팁 보이기
			e.preventDefault();
			$($this.attr('href')).removeClass('hide');
		}
	},
	change:function(e){
		var $this = $(e.target);
		if( $this.is('select.tc_3_h') ){//셀렉트 박스 컬러 변경
			$this.addClass('tc_3');
		}
		if( $this.is('input[data-type=checkAll]') ){//테이블 체크박스 전체 선택
			var checkboxs = $this.closest('table').find('tbody input[type=checkbox]');
			checkboxs.each(function(e){
				$(this).prop('checked',$this.prop('checked'))
			})
		}
		if( $this.is('select[data-type=changeEmail]') ){//이메일 바꾸기
			var input = $('input[data-type=inputEmail]');
			input.prop('value',$this.val());
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
		if( $this.is('a[data-type=tooltip]') ){//툴팁 가리기
			$($this.attr('href')).addClass('hide');
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
			$this.next('.count').find('span').text(count);
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
	if($.browser.msie){$('html').addClass('ie')}
});





















