<?php
header('content-type:text/html;charset="utf-8"');
error_reporting(0);

$news = array(
	array('title'=>'2020年全面建设小康社会的基本标准','date'=>'2020-1-6'),
	array('title'=>'2020年欧洲足球锦标赛','date'=>'2020-1-6'),
	array('title'=>'艺术拔尖生，2020年高招取消降分录取','date'=>'2020-1-6'),
	array('title'=>'路虎宣布全新卫士2019年亮相 2020年正式上市','date'=>'2020-1-6'),
	array('title'=>'工信部:2020年实现高级别自动驾驶特定场景应用','date'=>'2020-1-6'),
	array('title'=>'2020年全面建设小康社会的基本标准','date'=>'2020-1-6'),
	array('title'=>'2020年欧洲足球锦标赛','date'=>'2020-1-6'),
	array('title'=>'艺术拔尖生，2020年高招取消降分录取','date'=>'2020-1-6'),
	array('title'=>'路虎宣布全新卫士2019年亮相 2020年正式上市','date'=>'2020-1-6'),
);

echo json_encode($news);    // 返回全部的news对象
