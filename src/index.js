function toArr(any) {
	return any == null ? [] : Array.isArray(any) ? any : [any];
}

function toVal(out, key, val, opts) {

	var x, old=out[key];
	/**
	 * 完全看不懂是什么意思呢？？？？
	 * 
	 * ~indexOf() 区别 -1 和 0 的问题 模拟 布尔值的场景
	 * 
	 */
	var nxt=(
		!!~opts.string.indexOf(key) ? (val == null || val === true ? '' : String(val))
		: typeof val === 'boolean' ? val
		: !!~opts.boolean.indexOf(key) ? (val === 'false' ? false : val === 'true' || (out._.push((x = +val,x * 0 === 0) ? x : val),!!val))
		: (x = +val,x * 0 === 0) ? x : val
	);
	// 支持值为数组模式
	out[key] = old == null ? nxt : (Array.isArray(old) ? old.concat(nxt) : [old, nxt]);
}

function parse(args, opts) {
	// 代码健壮性处理
	args = args || [];
	opts = opts || {};

	var k, arr, arg, name, val, out={ _:[] };
	var i=0, j=0, idx=0, len=args.length;

	const alibi = opts.alias !== void 0;
	const strict = opts.unknown !== void 0;
	const defaults = opts.default !== void 0;

	opts.alias = opts.alias || {};
	opts.string = toArr(opts.string);
	opts.boolean = toArr(opts.boolean);

	// 获取别名之前的映射数组
	if (alibi) {
		for (k in opts.alias) {
			arr = opts.alias[k] = toArr(opts.alias[k]);
			for (i=0; i < arr.length; i++) {
				(opts.alias[arr[i]] = arr.concat(k)).splice(i, 1);
			}
		}
	}

	console.log(opts.alias)

	// 处理别名中遗漏的 boolean 类型，这里会出现重复的问题！！！！！
	for (i=opts.boolean.length; i-- > 0;) {
		arr = opts.alias[opts.boolean[i]] || [];
		for (j=arr.length; j-- > 0;) opts.boolean.push(arr[j]);
	}

	// 与上述一样的操作
	for (i=opts.string.length; i-- > 0;) {
		arr = opts.alias[opts.string[i]] || [];
		for (j=arr.length; j-- > 0;) opts.string.push(arr[j]);
	}

	// 默认值的处理 各个类型中添加
	if (defaults) {
		for (k in opts.default) {
			name = typeof opts.default[k];
			arr = opts.alias[k] = opts.alias[k] || [];
			if (opts[name] !== void 0) {
				opts[name].push(k);
				for (i=0; i < arr.length; i++) {
					opts[name].push(arr[i]);
				}
			}
		}
	}

	const keys = strict ? Object.keys(opts.alias) : [];

	for (i=0; i < len; i++) {
		arg = args[i];
		// 表示后面的参数不解析
		if (arg === '--') {
			out._ = out._.concat(args.slice(++i));
			console.log(out._)
			break;
		}

		for (j=0; j < arg.length; j++) {
			if (arg.charCodeAt(j) !== 45) break; // "-"
		}

		if (j === 0) {
			out._.push(arg);
		} else if (arg.substring(j, j + 3) === 'no-') {
			name = arg.substring(j + 3);
			if (strict && !~keys.indexOf(name)) {
				return opts.unknown(arg);
			}
			out[name] = false;
		} else {
			// 
			for (idx=j+1; idx < arg.length; idx++) {
				if (arg.charCodeAt(idx) === 61) break; // "="
			}

			name = arg.substring(j, idx);
			/**
			 * 1、取等号后面的值
			 * 2、取空格后面的值
			 * 3、如果后面是 - 开头的也行
			 * 4、当前是最后一个值也行 
			 * 
			 * 2、3、4 都是 boolean 类型的
			 */
			val = arg.substring(++idx) || (i+1 === len || (''+args[i+1]).charCodeAt(0) === 45 || args[++i]);
			arr = (j === 2 ? [name] : name); // - 则是字符串 -- 则是数组
			console.log('arr => ', arr);
			for (idx=0; idx < arr.length; idx++) {
				name = arr[idx];
				console.log('item => ', name)
				if (strict && !~keys.indexOf(name)) return opts.unknown('-'.repeat(j) + name);
				/**
				 * ！！！！ = 后面的值为最后一个参数的值
				 * 
				 * 并且需要根据 boolean 或者 string 将值格式化
				 */
				toVal(out, name, (idx + 1 < arr.length) || val, opts);
			}
		}
	}

	if (defaults) {
		// 传入的默认值作为兜底策略
		for (k in opts.default) {
			if (out[k] === void 0) {
				out[k] = opts.default[k];
			}
		}
	}

	if (alibi) {
		for (k in out) {
			arr = opts.alias[k] || [];
			// 覆盖 别名的值
			while (arr.length > 0) {
				out[arr.shift()] = out[k];
			}
		}
	}
	console.log(out)
	return out;
}

parse(process.argv.slice(2))

module.exports = parse;