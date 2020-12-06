export const removeEmojis = (value: string) => {
  const regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
  return value.replace(regex, '');
}

export const validateTZ = (str) => {
  // DEFINE RETURN VALUES
  let R_ELEGAL_INPUT = -1;
  // let R_NOT_VALID = this.generalService.language.getValue() === 'he' ? 'מספר ת.ז לא חוקי' : 'TZ is not valid';
  // let R_VALID = this.generalService.language.getValue() === 'he' ? 'מספר ת.ז  חוקי' : 'TZ is valid';
  //INPUT VALIDATION
  // Just in case -> convert to string
  let IDnum = String(str);
  // Validate correct input
  if ((IDnum.length > 9) || (IDnum.length < 5))
    return R_ELEGAL_INPUT;
  if (isNaN(+IDnum))
    return R_ELEGAL_INPUT;
  // The number is too short - add leading 0000
  if (IDnum.length < 9) {
    while (IDnum.length < 9) {
      IDnum = '0' + IDnum;
    }
  }
  // CHECK THE ID NUMBER
  var mone = 0, incNum;
  for (var i = 0; i < 9; i++) {
    incNum = Number(IDnum.charAt(i));
    incNum *= (i % 2) + 1;
    if (incNum > 9)
      incNum -= 9;
    mone += incNum;
  }
  if (mone % 10 == 0) {
    // this.toastr.success('', R_VALID);
    // R_VALID
    return true;
  }
  else {
    // this.toastr.warning('', R_NOT_VALID);
    // R_NOT_VALID
    return false;
  }
}
