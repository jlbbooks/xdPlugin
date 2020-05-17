/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/

const xd = require("scenegraph");

const $ = require("../utils");

class Blend {
	
	constructor(xdNode, child) {
		this.xdNode = xdNode;
		this.children = [ child ];
	}

	toString(serializer, ctx) {
		let o = this.xdNode, opacity = o.opacity;
		let region = "", child = this.children[0];
		if (child.xdNode instanceof xd.Group) {
			let lx = $.fix(o.boundsInParent.x);
			let ly = $.fix(o.boundsInParent.y);
			let lw = $.fix(o.boundsInParent.width);
			let lh = $.fix(o.boundsInParent.height);
			region = `region: Offset(${lx}, ${ly}) & Size(${lw}, ${lh}),`;
		}

		let mode = Blend.MODE_MAP[o.blendMode];
		if (!mode) { ctx.warn(`Unsupported blend mode '${o.blendMode}'`, o); }
		let str = "BlendMask(" +
			`blendMode: BlendMode.${mode || "src"},` +
			`opacity: ${opacity},` +
			region +
			`child: ${child.toString(serializer, ctx)},` +
			")";

		return str;
	}
}

Blend.MODE_MAP = {
	"pass-through": "src",
	"normal": "srcOver",
	"darken": "darken",
	"multiply": "multiply",
	"color-burn": "colorBurn",
	"lighten": "lighten",
	"screen": "screen",
	"color-dodge": "colorDodge",
	"overlay": "overlay",
	"soft-light": "softLight",
	"hard-light": "hardLight",
	"difference": "difference",
	"exclusion": "exclusion",
	"hue": "hue",
	"saturation": "saturation",
	"color": "color",
	"luminosity": "luminosity",
}

exports.Blend = Blend;
