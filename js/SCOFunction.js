	//*************************************************
	// LMS �⺻ ���� �Լ�
	//*************************************************
	// �ڵ����� �������̵��� ���� �������� �˻����ش�.
	var win = this;
	var findAPITries = 0;
	while((win.CMS_API == undefined || win.CMS_API == null))
	{
	   findAPITries++;
	
	   if ( findAPITries > 10 )
	   {
	   	break;
	      //alert( "CMS Api �������� ã�� �� �����ϴ�.");
	   }
	
	   win = win.parent;
	}
	// ���� �������� �̵��� �� ȣ��Ǵ� �Լ� 
	function goNext() {
		setCommit();
	  setTimeout("win.CMS_API.nextPage()",1000);
	}
	// ���� �������� �̵� �� ȣ��Ǵ� �Լ�
	function goBack() {
		setCommit();
	 win.CMS_API.prePage();
	}
    
	// ���� ����(�Ǵ� ��, ��)�� Ư�� ������ �̵� �� ȣ��Ǵ� �Լ�
	function goPageBack(page) {
	 win.CMS_API.prePageBack(page);
	}
	 
    // Ư�� �������� �ٷ� ȣ���� ���
	function goCMSView(page) {
	  win.CMS_API.viewRealPage(page);
	}

	// ���� �������� �̵��� �� ȣ��Ǵ� �Լ� 
	function goCMSNext(page) {//alert('NextSco')
	  win.CMS_API.nextRealPage(page);
	}
	// ���� �������� �̵� �� ȣ��Ǵ� �Լ�
	function goCMSBack(page) {//alert('PrevSco')
	 win.CMS_API.preRealPage(page);
	}

	
	// Flash Object ����
	function swfWriteSco(arg1) {
	    var swfTags = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'
	        + 'width="1010" height="558" id="mainflash" name="mainflash"'
	        + 'codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab">'
	        + '<param name="movie" value="' + arg1 + '" /><param name="quality" value="high" /><param name="bgcolor" value="#ffffff" />'
	        + '<param name="flashvars" value=>'
	        + '<param name="wmode" value="transparent">'
	        + '<param name="windowlessVideo" value="true" />'  //�߰�����
	        + '<embed src="' + arg1 + '" quality="high" bgcolor="#ffffff" '
	        + 'width="1010" height="558" name="mainflash" valign="top"'
	        + 'play="true"'
	        + 'loop="false"'
	        + 'quality="high"'
	        + 'wmode="transparent"'
	        + 'allowScriptAccess="sameDomain"'
	        + 'type="application/x-shockwave-flash"'
	        + 'pluginspage="http://www.macromedia.com/go/getflashplayer">'
	        + '<\/embed>'
	        + '<\/object>';
	    document.write(swfTags);
	}

	//*********************��***************************
	// �ǰ߶� function - LMS����?
	//*************************************************
	// �ǰ��� �����ִ� �˾� ������ ȣ��
	function writeOpinion(no, content) {
        win.CMS_API.writeOpinion(no, content);
	}
	
	// �ǰ��� �����ִ� �˾� ������ ȣ��
	function viewOpinion(no) {
		win.CMS_API.viewOpinion(no);
	}
	
	// �������� ������Ʈ�ѿ� ���� üũ���� ������ ���� ������ �Լ� ����
	//  �� ���������� ������Ʈ���� �Ϸ����� �� ȣ���� �ֹǷ� LMS���� ���� ��������
	// �̵��� ������ �� �ִ� ������ ����Ѵ�.
	var completeMoveControl = "N";
	//function moveControlCheck(){
	//    completeMoveControl = "Y";
	//}
	
	function setBookmark(){ //���� �������� DB�� �ϸ�ũ�� ����� �ش�.
	    var locPath = location.pathname;
	    win.CMS_API.setBookmark(locPath);
	}
	
  function setCommit(){ //Ʈ��ŷ ������ DB�� ������Ʈ ���ش�.
		win.CMS_API.setCommit()
  }
    
	// ����/���� �˾��� ����ش�.
	function goScore(){
		win.CMS_API.goScore();
	}
	
	// ���������� ����ش�.
	function goReport (){
		win.CMS_API.goReport ();
	}
	
	// ����
	function goSulmun(){
		win.CMS_API.goSulmun();
	} 
	
	// ������
	function goTest(){
	   win.CMS_API.goTest();
	}
	
	// �������� �˾��� ����ش�.
	function goNotice(){
		win.CMS_API.goNotice();
	}
	
	// ������ �˾��� ����ش�.
	function goQuestion (){
		win.CMS_API.goQuestion ();
	}
	
	// �ڷ�� �˾��� ����ش�.
	function goData(){
		win.CMS_API.goData();
	}
	
	// �Խ��� �˾��� ����ش�.
	function goBoard (){
		win.CMS_API.goBoard ();
	}
	
	// ��������Ȳ
	function goLearner(){
		win.CMS_API.goLearner();
	}
	
	// ����Ұ�
	function goTutor(){
		win.CMS_API.goTutor();
	}
	
	// ��й� �˾��� ����ش�.
	function goForum (){
		win.CMS_API.goForum ();
	}
	
	// ������ �˾��� ����ش�.
	function goDictionary (){
		win.CMS_API.goDictionary ();
	}
	
	// ���û���Ʈ �˾��� ����ش�.
	function goSite (){
		win.CMS_API.goSite ();
	}
	
	// �н������ �˾��� ����ش�.
	function goHelper (){
		win.CMS_API.goHelper ();
	}
	function closeTopWin() {
	window.top.close();
}