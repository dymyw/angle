# angle
jquery.angle.js - `jQuery` plugin

------

#### 使用说明
##### 引入必要的文件，当然还需要 `jQuery` 库
```javascript
<link type="text/css" rel="stylesheet" href="angle.css" />
<script type="text/javascript" src="jquery.angle.js"></script>
```

##### 参数列表
|      参数名     |       类型       |         默认值         |     说明     |
| -------------- | ---------------- | --------------------- | ------------ |
| speed          |     integer      |     2                 | 变换速度，越大越快 |
| drag           |     boolean      |     false             | 是否支持拖拽 |
| previous       |     selector     |                       | 点击展示上一个 |
| next           |     selector     |                       | 点击展示下一个 |
| current        |     integer      |     0                 | 当前项 |
| get_items      |     function     |     function() {}     | 动态加载 items |
| after          |     function     |     function() {}     | 每次变换后执行的函数 |

##### 举例说明
```html
<div class="angle-view" id="angle-view">
    <ul>
        <li><img src="images/01.jpg" alt="01" /></li>
        <li><img src="images/02.jpg" alt="02" /></li>
        <li><img src="images/03.jpg" alt="03" /></li>
        <li><img src="images/04.jpg" alt="04" /></li>
        <li><img src="images/05.jpg" alt="05" /></li>
        <li><img src="images/06.jpg" alt="06" /></li>
        <li><img src="images/07.jpg" alt="07" /></li>
        <li><img src="images/08.jpg" alt="08" /></li>
        <li><img src="images/09.jpg" alt="09" /></li>
        <li><img src="images/10.jpg" alt="10" /></li>
        <li><img src="images/11.jpg" alt="11" /></li>
        <li><img src="images/12.jpg" alt="12" /></li>
        <li><img src="images/13.jpg" alt="13" /></li>
        <li><img src="images/14.jpg" alt="14" /></li>
        <li><img src="images/15.jpg" alt="15" /></li>
        <li><img src="images/16.jpg" alt="16" /></li>
    </ul>
</div>
```

```javascript
$('#angle-view').angle({
    speed: 1,
    drag: true,
	previous: '.prev',
	next: '.next',
	current: 2,
	after: function() {
		console.log('after');
	}
});
```
更多实例请参考 example.html

------

#### 变更记录
##### 2014.09.03 Version v1.3
 * Fix angle view in popup

##### 2014.01.03 Version v1.1
 * Add speed options
 * Remove width & height options, just get from CSS
 * In the container, touch event can vertical scrolling
 * Add drag options used by mouse
