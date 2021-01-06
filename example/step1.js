function isNoDef(val) {
  if (val === undefined || val === null) {
    return true;
  }
  return false;
}

function isDef(val) {
  if (val === undefined || val === null) {
    return false;
  }
  return true;
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

function handleKeyValue(output, key, value) {
  const oldValue = output[key];
  // （6）多次赋值的问题
  if (Array.isArray(oldValue)) {
    output[key] = oldValue.concat(value);
    return;
  }

  if (oldValue) {
    output[key] = [oldValue, value];
    return;
  }

  output[key] = value;
}

function isIgnoreFollowingParameters(output, args, index, arg) {
  if (arg !== '--') {
    return false;
  }
  output._ = output._.concat(args.slice(++index));
  return true;
}

function isParameter(arg) {
  return arg.startsWith('-');
}

function handlerParameter(arg) {
  let name;
  let value;
  /**
   * 首先判断是否为：
   * 
   * -key=value
   * --key=value
   * 
   * 这两种形式
   */
  const result = /^(?:--|-)(\w+?)=(\w+?)$/.exec(arg);
  if (result) {
    [, name, value] = result;
  } else {
    /^(?:-|--)[^-]/.test(arg)
  }
}

function parse(args = []) {
  const output = { _: [] };

  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    
    //（1）单个「--」后面的内容不再处理
    if (isIgnoreFollowingParameters(output, args, index, arg)) {
      break;
    }
    
    // （2）判断是否为参数 「-」或者「--」
    if (!isParameter(arg)) {
      output._.push(arg);
      continue;
    }


    let hyphensIndex;
    for (hyphensIndex = 0; hyphensIndex < arg.length; hyphensIndex++) {
      if (arg.charCodeAt(hyphensIndex) !== 45) {
        break;
      }
    }

    let assignmentIndex;
    for (assignmentIndex = hyphensIndex + 1; assignmentIndex < arg.length; assignmentIndex++) {
      if (arg[assignmentIndex].charCodeAt(0) === 61) {
        break;
      }
    }

    const name = arg.substring(hyphensIndex, assignmentIndex);

    let value;
    const assignmentValue = arg.substring(++assignmentIndex);
    if (assignmentValue) {
      value = assignmentValue;
    } else if (index + 1 === args.length) {
      value = true;
    } else if (('' + args[index + 1]).charCodeAt(0) !== 45) {
      value = args[++index];
    }

    const arr = hyphensIndex === 2 ? [name] : name;
    for (let keyIndex = 0; keyIndex < arr.length; keyIndex++) {
      const _key = arr[keyIndex];
      const _value = keyIndex + 1 < arr.length || value;
      handleKeyValue(output, _key, _value);
    }
  }

  return output;
}

console.log(parse(process.argv.slice(2)));

