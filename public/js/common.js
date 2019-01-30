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
	},
	brandWidthSet = function(el){
		var w = $(el).closest('li').width()-10;
		$(el).closest('li').find('.brand').css('max-width',w-$(el).width());
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
	};
$(document).ready(function(){
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
		},
		change:function(e){
			var $this = $(e.target);
			if( $this.is('select.tc_3_h') ){//셀렉트 박스 컬러 변경
				$this.addClass('tc_3');
			}
			if( $this.is('input[data-type=checkAll]') ){//테이블 체크박스 전체 선택
				var checkboxs = $this.closest('table').find('tbody input[type=checkbox]:not(:disabled)');
				checkboxs.each(function(e){
					$(this).prop('checked',$this.prop('checked'))
				})
			}
		},
		mouseover:function(e){
			var $this = $(e.target);
			if( $this.closest('button').is('[data-type*=qnaview]') ){//qna 버튼 오버 줄표시
				$this.closest('button').prev().addClass('over')
			}
		},
		mouseout:function(e){
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
});





















