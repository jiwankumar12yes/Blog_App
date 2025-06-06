export const slugify=(text:string):string=>{
    return text 
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

export const generateUniqueSlug = async (title: string, model: any, field = 'slug'): Promise<string> => {
    let slug = slugify(title);
    let existing = await model.findFirst({ where: { [field]: slug } });
    let counter = 1;
  
    while (existing) {
      const newSlug = `${slug}-${counter}`;
      existing = await model.findFirst({ where: { [field]: newSlug } });
      if (!existing) {
        slug = newSlug;
      }
      counter++;
    }
  
    return slug;
  };