const baseJoi=require('joi');
const sanitizeHtml = require('sanitize-html');

const extention=(joi)=>({
    type:'string',
    base:joi.string(),
    messages:{
        'string.escapeHTML':'{{#label}} must not include html'
    },
    rules: {
        escapeHTML:{
            validate(value,helpers){
                const clean=sanitizeHtml(value,{
                    allowedTags:[],
                    allowedAttributes:{},
                });
                if(clean!==value)return helpers.error('string.escapeHTML',{value})
                return clean
            }
        }
    }
})


const Joi=baseJoi.extend(extention)
const campgroundSchema = Joi.object({
    title: Joi.string().required().escapeHTML(),
    price: Joi.number().required().min(0),
    // image: Joi.string().required().escapeHTML(),
    image:Joi.object({
        url:Joi.string().required().escapeHTML(),
        filename:Joi.string().required().escapeHTML()
    }),
    description: Joi.string().required().escapeHTML(),
    location: Joi.string().required().escapeHTML()
})
const reviewSchema=Joi.object({
    review:Joi.object({
        cost:Joi.number().required().min(1),
        body:Joi.string().required().escapeHTML()
    }).required()
})
const changePasswordSchema=Joi.object({
    newPassword: Joi.string().required().escapeHTML(),
    confirmPassword: Joi.string().required().escapeHTML(),
}).required();
module.exports={campgroundSchema,reviewSchema};

