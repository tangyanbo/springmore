function fixWidthTable(percent) {
	return getWidth(1) * percent;
}
function getWidth(percent) {
	return $(window).width() * percent;
}