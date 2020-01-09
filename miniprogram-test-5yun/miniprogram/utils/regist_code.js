/*
** Translation Table as described in RFC1113
*/
var s_cb64= "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
/*
** Translation Table to decode (created by author)
*/
var s_cd64= "$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$b$$$cXYZ[\\]^_`a$$$$$$$$%&'()*+,-./0123456789:;<=$$$$$$>?@ABCDEFGHIJKLMNOPQRSTUVW$$$$$";

const BASE64_PARAM_ERR = 1
/*
** base64编码
**
** encode 3 8-bit binary bytes as 4 '6-bit' characters
*/
function encodeblock(in_array,out_array,len,cb64)
//in_array是长度为3 的数组，out_array是长度为4的数组,len是整数cb64是字符串
{
  out_array[0] = cb64[in_array [0] >> 2];
  out_array[1] = cb64[((in_array[0] & 0x03) << 4) | ((in_array [1] & 0xf0) >> 4)];
  out_array[2] = (len > 1 ? cb64[((in_array [1] & 0x0f) << 2) | ((in_array [2] & 0xc0) >> 6)] : cb64[64]);
  out_array[3] = (len > 2 ? cb64[in_array [2] & 0x3f] : cb64[64]);
  //原来c代码中用的是指针，所以没有return
  return cb64
}

/**
 *		将字符串转换成自定义的base64编码
 *@srcStr		原字符串
 *@length		原字符串长度,如果传入0表示到字符'\0'
 *@destStr		保存转码后的缓冲区，由于base64转码字符串会增大1/3，所有其缓冲区长度必须为原来的4/3。
 *@base64Str	自定义的base64字符串
 *@return		成功 返回 destStr字符串的长度
 *				失败 返回 -1
 */
function StringToBase64(srcStr,  length, destStr, base64Str)
{
  var i;
  var p = destStr;

  if (srcStr == '' || length < 0 || destStr == '' || base64Str == '') {
    return BASE64_PARAM_ERR;
  }

  //先给长度赋值
  if (length == 0) {
    length = srcStr.length;
  }

  for (i = 0; i < length; i += 3) {
    base64Str=encodeblock(srcStr, destStr, length - i, base64Str);
    srcStr += 3;
    destStr += 4;
  }

  return destStr - p;
}
function getone() {
  console.log(s_cb64)
}
module.exports = {
  getone: getone
}