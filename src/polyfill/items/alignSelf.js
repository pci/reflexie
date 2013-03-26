Flexbox.models.alignSelf = function (alignment, properties) {
	var crossStart = this.crossStart,
		crossSize = this.crossSize,
		multiplier,
		lines = this.lines,
		i, j, k, l, line, item,
		lineRemainder;

	var values = this.values;
	var mainSize = this.mainSize;
	var containerSize = values.container[mainSize];

	var crossTotal = crossStart + "Total";

	var isNotFlexWrap = properties["flex-wrap"] === "nowrap";
	var isAlignContentStretch = properties["align-content"] === "stretch";

	var alignSelf, lineSize;
	var isStart, isCenter, isStretch, isBaseline;

	var remainderSize = this.remainderSize;
	var currentRemainderSize;

	for (i = 0, j = lines.length; i < j; i++) {
		line = lines[i];

		for (k = 0, l = line.items.length; k < l; k++) {
			item = line.items[k];
			multiplier = 1;
			currentRemainderSize = remainderSize;

			if (!item.debug || !item.debug.properties) {
				return;
			}

			alignSelf = item.debug.properties["align-self"];

			// If auto, align-self value is inherited from align-items
			if (alignSelf === "auto") {
				alignSelf = properties["align-items"];
			}

			isStart = alignSelf === "flex-start";
			isCenter = alignSelf === "center";
			isStretch = alignSelf === "stretch";
			isBaseline = alignSelf === "baseline";

			if (isStretch && isNotFlexWrap) {
				lineRemainder = values.container[crossSize] / lines.length;

				if (item.debug.auto[crossSize]) {
					if (i) {
						item[crossStart] += (lineRemainder - item[crossSize]) * i;
					}

					item[crossSize] = (lineRemainder - item.debug.inner[crossStart] - item.debug.margin[crossTotal]);
				}
			} else if (isStretch) {
				if (item.debug.auto[crossSize]) {
					item[crossSize] = ((isAlignContentStretch ? line.maxSize : line.maxItemSize) - item.debug.inner[crossStart]) - item.debug.margin[crossTotal];
				}
			}

			// No furths if any of these apply
			if (isStretch || isStart || isBaseline) {
				continue;
			}

			if (isCenter) {
				multiplier = 0.5;
				currentRemainderSize *= 0.5;
			}

			if (!isNotFlexWrap && !isAlignContentStretch) {
				currentRemainderSize = 0;
			}

			lineRemainder = line.maxItemSize;

			// Remove margin from crossStart
			item[crossStart] -= item.debug.margin[crossTotal] * multiplier;

			// Magic line
			item[crossStart] += currentRemainderSize + (lineRemainder - (item[crossSize] + item.debug.inner[crossStart])) * multiplier;
		}
	}
};
