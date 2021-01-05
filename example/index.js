function isNoDef(val) {
  if (val === undefined || val === null) {
    return true;
  }
  return false;
}

function toArr(val) {
  if (isNoDef(val)) {
    return [];
  }

  if (Array.isArray(val)) {
    return val;
  }
  return [val];
}

function supplementOmissionElement(aliasArr, targetSet) {
  for (let item of targetSet.values()) {
    const arr = aliasArr[item] || [];
    for (let sub of arr) {
      targetSet.add(sub);
    }
  }
}

function handleKeyValue(output, key, value, options) {
  const oldValue = output[key];
  let next;

  const { string, boolean, number } = options;

  if (string.has(key)) {
    next = String(value);
  } else if (boolean.has(key)) {
    next = !!value;
  } else if (number.has(key)) {
    next = +value;
  } else {
    next = value;
  }

  // 多次赋值的问题
  if (Array.isArray(oldValue)) {
    output[key] = oldValue.concat(next);
    return;
  }

  if (oldValue) {
    output[key] = [oldValue, next];
    return;
  }

  output[key] = next;
}

function parse(args = {}, options = {}) {
  const output = { _: [] };

  const { defaultValue, alias } = options;

  const hasAlias = alias !== void 666;
  const hasDefault = defaultValue !== void 666;

  let { boolean, string, number } = options;

  boolean = options.boolean = new Set(toArr(boolean));
  string = options.string = new Set(toArr(string));
  number = options.number = new Set(toArr(number));

  /**
   * 处理别名的问题
   * 
   * 单个映射关系
   * 
   * help: 'h'
   * ---------
   * help: 'h'
   * h: 'help'
   * 
   * h: true, help: true
   * 
   * 多个映射关系
   * 
   * 
   * 形成多个映射关系？？？
   * 
   * 
   * 
   * 如果形成一个映射关系
   */
  if (hasAlias) {
    Object.keys(alias).forEach(key => {
      alias[key] = toArr(alias[key]);
      alias[key].forEach((item, index) => {
        (alias[item] = alias[key].concat(key)).splice(index, 1);
      })
    })
  }

  // 避免 boolean 中缺少字段
  supplementOmissionElement(alias, boolean);

  // 避免 string 中缺少字段
  supplementOmissionElement(alias, string);

  // 避免 number 中缺少字段
  supplementOmissionElement(alias, number);

  // 处理默认值
  if (hasDefault) {
    Object.keys(defaultValue).forEach(key => {
      const type = typeof defaultValue[key];
      if (options[type]) {
        options[type].add(key);
        if (alias[key]) {
          alias[key].forEach(item => options[type].add(item))
        }
      }
    })
  }

  // 解析参数数组
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    // 「--」 表示忽略后面的参数
    if (arg === '--') {
      output._ = output._.concat(args.slice(++i));
			break;
    }
    
    /**
     * 处理不同风格的参数
     */
    let index;
    for (index = 0; index < arg.length; index++) {
      if (arg.charCodeAt(index) !== 45) {
        break;
      }
    }

    if (index === 0) {
      output._.push(arg);
    } else {
      // 是否存在赋值
      let assignmentIndex;
      for (assignmentIndex = 0; assignmentIndex < arg.length; assignmentIndex++) {
        if (arg[assignmentIndex].charCodeAt(0) === 61) {
          break;
        }
      }

      const name = arg.substring(index, assignmentIndex);
      /**
			 * 1、取等号后面的值
			 * 2、取空格后面的值
			 * 3、如果后面是 - 开头的也行
			 * 4、当前是最后一个值也行 
			 * 
			 * 2、3、4 都是 boolean 类型的
			 */
      const value = arg.substring(++assignmentIndex) || (i + 1 === args.length || ('' + args[i + 1]).charCodeAt(0) === 45 || args[++i]);
      const arr = index === 2 ? [name] : name;
      for (let keyIndex = 0; keyIndex < arr.length; keyIndex++) {
        const _key = arr[keyIndex];
        const _value = keyIndex + 1 < arr.length || value;
        handleKeyValue(output, _key, _value, options);
      }
    }
  }

  // 参数的默认值
  if (hasDefault) {
    Object.keys(defaultValue).forEach(key => {
      if (output[key] === void 666) {
        output[key] = defaultValue[key];
      }
    })
  }

  // 别名的处理
	if (hasAlias) {
    Object.keys(output).forEach(key => {
      const arr = alias[key] || [];
      arr.forEach(sub => output[sub] = output[key])
    })
	}
  console.log(options)
  console.log(output)

  return output;
}

parse(process.argv.slice(2), {
  alias: {
    help: 'h',
  },
  defaultValue: {
    age: 20
  },
  number: ['c']
})

