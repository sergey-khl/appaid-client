
const getNumber = (convert: string | number) => {
        if (typeof convert === "number") {
          return convert;
        }
        const valid_style = new RegExp(/\D$/g);
        return parseFloat(convert.replace(valid_style, ''))
    }

export {getNumber}