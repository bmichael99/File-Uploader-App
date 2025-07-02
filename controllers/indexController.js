const { body, validationResult } = require("express-validator");
const db = require("../db/queries")
const passport = require("passport");
const bcrypt = require("bcryptjs")
const { isAuth } = require("../controllers/authMiddleware");
require('dotenv').config()

const mimeTypeIcons = {
  //images
  "image/jpeg" : `<svg viewBox="0 -2 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>image_picture [#972]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-380.000000, -3881.000000)" fill="#000000"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M336,3725.5 C336,3724.948 336.448,3724.5 337,3724.5 C337.552,3724.5 338,3724.948 338,3725.5 C338,3726.052 337.552,3726.5 337,3726.5 C336.448,3726.5 336,3726.052 336,3725.5 L336,3725.5 Z M340,3733 L328,3733 L332.518,3726.812 L335.354,3730.625 L336.75,3728.75 L340,3733 Z M326,3735 L342,3735 L342,3723 L326,3723 L326,3735 Z M324,3737 L344,3737 L344,3721 L324,3721 L324,3737 Z" id="image_picture-[#972]"> </path> </g> </g> </g> </g></svg>`,
  "image/png": `<svg viewBox="0 -2 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>image_picture [#972]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-380.000000, -3881.000000)" fill="#000000"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M336,3725.5 C336,3724.948 336.448,3724.5 337,3724.5 C337.552,3724.5 338,3724.948 338,3725.5 C338,3726.052 337.552,3726.5 337,3726.5 C336.448,3726.5 336,3726.052 336,3725.5 L336,3725.5 Z M340,3733 L328,3733 L332.518,3726.812 L335.354,3730.625 L336.75,3728.75 L340,3733 Z M326,3735 L342,3735 L342,3723 L326,3723 L326,3735 Z M324,3737 L344,3737 L344,3721 L324,3721 L324,3737 Z" id="image_picture-[#972]"> </path> </g> </g> </g> </g></svg>`,
  "image/svg+xml": `<svg viewBox="0 -2 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>image_picture [#972]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-380.000000, -3881.000000)" fill="#000000"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M336,3725.5 C336,3724.948 336.448,3724.5 337,3724.5 C337.552,3724.5 338,3724.948 338,3725.5 C338,3726.052 337.552,3726.5 337,3726.5 C336.448,3726.5 336,3726.052 336,3725.5 L336,3725.5 Z M340,3733 L328,3733 L332.518,3726.812 L335.354,3730.625 L336.75,3728.75 L340,3733 Z M326,3735 L342,3735 L342,3723 L326,3723 L326,3735 Z M324,3737 L344,3737 L344,3721 L324,3721 L324,3737 Z" id="image_picture-[#972]"> </path> </g> </g> </g> </g></svg>`,

  //documents
  "application/pdf": `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><defs><style>.a{fill:none;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;}</style></defs><path class="a" d="M14,4.5H10.5a2,2,0,0,0-2,2v35a2,2,0,0,0,2,2h27a2,2,0,0,0,2-2V6.5a2,2,0,0,0-2-2H24"></path><path class="a" d="M12,4.5l1.4142-1.4142A2,2,0,0,1,14.8284,2.5H23a1,1,0,0,1,1,1v25l-5-5-5,5V4.5"></path><line class="a" x1="14" y1="38" x2="34" y2="38"></line><line class="a" x1="24" y1="10" x2="34" y2="10"></line><line class="a" x1="24" y1="17" x2="34" y2="17"></line><line class="a" x1="24" y1="24" x2="34" y2="24"></line><line class="a" x1="14" y1="31" x2="34" y2="31"></line></g></svg>`,
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><defs><style>.a{fill:none;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;}</style></defs><path class="a" d="M14,4.5H10.5a2,2,0,0,0-2,2v35a2,2,0,0,0,2,2h27a2,2,0,0,0,2-2V6.5a2,2,0,0,0-2-2H24"></path><path class="a" d="M12,4.5l1.4142-1.4142A2,2,0,0,1,14.8284,2.5H23a1,1,0,0,1,1,1v25l-5-5-5,5V4.5"></path><line class="a" x1="14" y1="38" x2="34" y2="38"></line><line class="a" x1="24" y1="10" x2="34" y2="10"></line><line class="a" x1="24" y1="17" x2="34" y2="17"></line><line class="a" x1="24" y1="24" x2="34" y2="24"></line><line class="a" x1="14" y1="31" x2="34" y2="31"></line></g></svg>`,
  "text/plain": `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><defs><style>.a{fill:none;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;}</style></defs><path class="a" d="M14,4.5H10.5a2,2,0,0,0-2,2v35a2,2,0,0,0,2,2h27a2,2,0,0,0,2-2V6.5a2,2,0,0,0-2-2H24"></path><path class="a" d="M12,4.5l1.4142-1.4142A2,2,0,0,1,14.8284,2.5H23a1,1,0,0,1,1,1v25l-5-5-5,5V4.5"></path><line class="a" x1="14" y1="38" x2="34" y2="38"></line><line class="a" x1="24" y1="10" x2="34" y2="10"></line><line class="a" x1="24" y1="17" x2="34" y2="17"></line><line class="a" x1="24" y1="24" x2="34" y2="24"></line><line class="a" x1="14" y1="31" x2="34" y2="31"></line></g></svg>`,

  //audio
  "audio/mpeg": `<svg height="200px" width="200px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> .st0{fill:#000000;} </style> <g> <path class="st0" d="M378.409,0H208.294h-13.175l-9.315,9.314L57.016,138.102l-9.314,9.314v13.176v265.513 c0,47.361,38.528,85.896,85.896,85.896h244.811c47.36,0,85.888-38.535,85.888-85.896V85.895C464.298,38.528,425.769,0,378.409,0z M432.494,426.104c0,29.877-24.215,54.092-54.084,54.092H133.598c-29.877,0-54.092-24.215-54.092-54.092V160.591h83.717 c24.885,0,45.07-20.179,45.07-45.07V31.804h170.116c29.87,0,54.084,24.214,54.084,54.091V426.104z"></path> <path class="st0" d="M204.576,254.592v76.819c-6.483-2.388-14.156-3.093-22.054-1.571c-18.974,3.651-32.038,18.622-29.185,33.424 c2.856,14.809,20.538,23.851,39.516,20.192c16.837-3.24,29-15.403,29.521-28.474h0.104V253.413l90.934-13.671v75.632 c-6.486-2.381-14.157-3.079-22.054-1.557c-18.974,3.644-32.035,18.615-29.186,33.424c2.856,14.802,20.538,23.844,39.516,20.186 c16.838-3.247,29.001-15.403,29.514-28.466h0.112V238.562v-33.368l-126.738,16.024V254.592z"></path> </g> </g></svg>`,
  "audio/wav": `<svg height="200px" width="200px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> .st0{fill:#000000;} </style> <g> <path class="st0" d="M378.409,0H208.294h-13.175l-9.315,9.314L57.016,138.102l-9.314,9.314v13.176v265.513 c0,47.361,38.528,85.896,85.896,85.896h244.811c47.36,0,85.888-38.535,85.888-85.896V85.895C464.298,38.528,425.769,0,378.409,0z M432.494,426.104c0,29.877-24.215,54.092-54.084,54.092H133.598c-29.877,0-54.092-24.215-54.092-54.092V160.591h83.717 c24.885,0,45.07-20.179,45.07-45.07V31.804h170.116c29.87,0,54.084,24.214,54.084,54.091V426.104z"></path> <path class="st0" d="M204.576,254.592v76.819c-6.483-2.388-14.156-3.093-22.054-1.571c-18.974,3.651-32.038,18.622-29.185,33.424 c2.856,14.809,20.538,23.851,39.516,20.192c16.837-3.24,29-15.403,29.521-28.474h0.104V253.413l90.934-13.671v75.632 c-6.486-2.381-14.157-3.079-22.054-1.557c-18.974,3.644-32.035,18.615-29.186,33.424c2.856,14.802,20.538,23.844,39.516,20.186 c16.838-3.247,29.001-15.403,29.514-28.466h0.112V238.562v-33.368l-126.738,16.024V254.592z"></path> </g> </g></svg>`,
  "audio/ogg": `<svg height="200px" width="200px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> .st0{fill:#000000;} </style> <g> <path class="st0" d="M378.409,0H208.294h-13.175l-9.315,9.314L57.016,138.102l-9.314,9.314v13.176v265.513 c0,47.361,38.528,85.896,85.896,85.896h244.811c47.36,0,85.888-38.535,85.888-85.896V85.895C464.298,38.528,425.769,0,378.409,0z M432.494,426.104c0,29.877-24.215,54.092-54.084,54.092H133.598c-29.877,0-54.092-24.215-54.092-54.092V160.591h83.717 c24.885,0,45.07-20.179,45.07-45.07V31.804h170.116c29.87,0,54.084,24.214,54.084,54.091V426.104z"></path> <path class="st0" d="M204.576,254.592v76.819c-6.483-2.388-14.156-3.093-22.054-1.571c-18.974,3.651-32.038,18.622-29.185,33.424 c2.856,14.809,20.538,23.851,39.516,20.192c16.837-3.24,29-15.403,29.521-28.474h0.104V253.413l90.934-13.671v75.632 c-6.486-2.381-14.157-3.079-22.054-1.557c-18.974,3.644-32.035,18.615-29.186,33.424c2.856,14.802,20.538,23.844,39.516,20.186 c16.838-3.247,29.001-15.403,29.514-28.466h0.112V238.562v-33.368l-126.738,16.024V254.592z"></path> </g> </g></svg>`,

  //video
  "video/mp4": `<svg height="200px" width="200px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> .st0{fill:#000000;} </style> <g> <path class="st0" d="M378.409,0H208.294h-13.175l-9.315,9.314L57.016,138.102l-9.314,9.314v13.176v265.513 c0,47.361,38.528,85.896,85.896,85.896h244.811c47.36,0,85.888-38.535,85.888-85.896V85.895C464.298,38.528,425.769,0,378.409,0z M432.493,426.104c0,29.877-24.214,54.092-54.084,54.092H133.598c-29.877,0-54.092-24.215-54.092-54.092V160.591h83.717 c24.885,0,45.07-20.179,45.07-45.07V31.804h170.116c29.87,0,54.084,24.214,54.084,54.091V426.104z"></path> <path class="st0" d="M326.573,212.783h-13.434v13.957H198.868v-13.957h-13.434h-13.448h-16.799v158.56h43.681v-13.958h114.271 v13.958h43.681v-158.56h-16.799H326.573z M185.434,357.756h-13.448v-21.149h13.448V357.756z M185.434,321.518h-13.448v-21.149 h13.448V321.518z M185.434,285.273h-13.448V264.13h13.448V285.273z M185.434,249.035h-13.448v-21.149h13.448V249.035z M313.139,341.912H198.868v-99.699h114.271V341.912z M340.021,357.756h-13.448v-21.149h13.448V357.756z M340.021,321.518h-13.448 v-21.149h13.448V321.518z M340.021,285.273h-13.448V264.13h13.448V285.273z M340.021,249.035h-13.448v-21.149h13.448V249.035z"></path> </g> </g></svg>`,
  "video/webm": `<svg height="200px" width="200px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> .st0{fill:#000000;} </style> <g> <path class="st0" d="M378.409,0H208.294h-13.175l-9.315,9.314L57.016,138.102l-9.314,9.314v13.176v265.513 c0,47.361,38.528,85.896,85.896,85.896h244.811c47.36,0,85.888-38.535,85.888-85.896V85.895C464.298,38.528,425.769,0,378.409,0z M432.493,426.104c0,29.877-24.214,54.092-54.084,54.092H133.598c-29.877,0-54.092-24.215-54.092-54.092V160.591h83.717 c24.885,0,45.07-20.179,45.07-45.07V31.804h170.116c29.87,0,54.084,24.214,54.084,54.091V426.104z"></path> <path class="st0" d="M326.573,212.783h-13.434v13.957H198.868v-13.957h-13.434h-13.448h-16.799v158.56h43.681v-13.958h114.271 v13.958h43.681v-158.56h-16.799H326.573z M185.434,357.756h-13.448v-21.149h13.448V357.756z M185.434,321.518h-13.448v-21.149 h13.448V321.518z M185.434,285.273h-13.448V264.13h13.448V285.273z M185.434,249.035h-13.448v-21.149h13.448V249.035z M313.139,341.912H198.868v-99.699h114.271V341.912z M340.021,357.756h-13.448v-21.149h13.448V357.756z M340.021,321.518h-13.448 v-21.149h13.448V321.518z M340.021,285.273h-13.448V264.13h13.448V285.273z M340.021,249.035h-13.448v-21.149h13.448V249.035z"></path> </g> </g></svg>`,
  "video/quicktime": `<svg height="200px" width="200px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> .st0{fill:#000000;} </style> <g> <path class="st0" d="M378.409,0H208.294h-13.175l-9.315,9.314L57.016,138.102l-9.314,9.314v13.176v265.513 c0,47.361,38.528,85.896,85.896,85.896h244.811c47.36,0,85.888-38.535,85.888-85.896V85.895C464.298,38.528,425.769,0,378.409,0z M432.493,426.104c0,29.877-24.214,54.092-54.084,54.092H133.598c-29.877,0-54.092-24.215-54.092-54.092V160.591h83.717 c24.885,0,45.07-20.179,45.07-45.07V31.804h170.116c29.87,0,54.084,24.214,54.084,54.091V426.104z"></path> <path class="st0" d="M326.573,212.783h-13.434v13.957H198.868v-13.957h-13.434h-13.448h-16.799v158.56h43.681v-13.958h114.271 v13.958h43.681v-158.56h-16.799H326.573z M185.434,357.756h-13.448v-21.149h13.448V357.756z M185.434,321.518h-13.448v-21.149 h13.448V321.518z M185.434,285.273h-13.448V264.13h13.448V285.273z M185.434,249.035h-13.448v-21.149h13.448V249.035z M313.139,341.912H198.868v-99.699h114.271V341.912z M340.021,357.756h-13.448v-21.149h13.448V357.756z M340.021,321.518h-13.448 v-21.149h13.448V321.518z M340.021,285.273h-13.448V264.13h13.448V285.273z M340.021,249.035h-13.448v-21.149h13.448V249.035z"></path> </g> </g></svg>`,

  //archives
  "application/zip": `<svg viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="layer1"> <path d="M 3 0 L 3 20 L 17 20 L 17 5 L 17 4 L 13 0 L 12 0 L 10 0 L 10 1 L 12 1 L 12 4 L 12 5 L 16 5 L 16 19 L 4 19 L 4 1 L 6 1 L 6 0 L 3 0 z M 8 0 L 8 1 L 9 1 L 9 0 L 8 0 z M 8 1 L 7 1 L 7 2 L 8 2 L 8 1 z M 8 2 L 8 3 L 9 3 L 9 2 L 8 2 z M 8 3 L 7 3 L 7 4 L 8 4 L 8 3 z M 8 4 L 8 5 L 9 5 L 9 4 L 8 4 z M 8 5 L 7 5 L 7 6 L 8 6 L 8 5 z M 8 6 L 8 7 L 9 7 L 9 6 L 8 6 z M 8 7 L 7 7 L 7 8 L 8 8 L 8 7 z M 8 8 L 8 9 L 9 9 L 9 8 L 8 8 z M 8 9 L 7 9 L 7 10 L 8 10 L 8 9 z M 13 1.3535156 L 15.646484 4 L 13 4 L 13 1.3535156 z M 7 11 L 6 15 L 6 18 L 10 18 L 10 15 L 9 11 L 7 11 z M 7 16 L 9 16 L 9 17 L 7 17 L 7 16 z " style="fill:#222222; fill-opacity:1; stroke:none; stroke-width:0px;"></path> </g> </g></svg>`,
  "application/x-7z-compressed": `<svg viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="layer1"> <path d="M 3 0 L 3 20 L 17 20 L 17 5 L 17 4 L 13 0 L 12 0 L 10 0 L 10 1 L 12 1 L 12 4 L 12 5 L 16 5 L 16 19 L 4 19 L 4 1 L 6 1 L 6 0 L 3 0 z M 8 0 L 8 1 L 9 1 L 9 0 L 8 0 z M 8 1 L 7 1 L 7 2 L 8 2 L 8 1 z M 8 2 L 8 3 L 9 3 L 9 2 L 8 2 z M 8 3 L 7 3 L 7 4 L 8 4 L 8 3 z M 8 4 L 8 5 L 9 5 L 9 4 L 8 4 z M 8 5 L 7 5 L 7 6 L 8 6 L 8 5 z M 8 6 L 8 7 L 9 7 L 9 6 L 8 6 z M 8 7 L 7 7 L 7 8 L 8 8 L 8 7 z M 8 8 L 8 9 L 9 9 L 9 8 L 8 8 z M 8 9 L 7 9 L 7 10 L 8 10 L 8 9 z M 13 1.3535156 L 15.646484 4 L 13 4 L 13 1.3535156 z M 7 11 L 6 15 L 6 18 L 10 18 L 10 15 L 9 11 L 7 11 z M 7 16 L 9 16 L 9 17 L 7 17 L 7 16 z " style="fill:#222222; fill-opacity:1; stroke:none; stroke-width:0px;"></path> </g> </g></svg>`,
  "application/vnd.rar": `<svg viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="layer1"> <path d="M 3 0 L 3 20 L 17 20 L 17 5 L 17 4 L 13 0 L 12 0 L 10 0 L 10 1 L 12 1 L 12 4 L 12 5 L 16 5 L 16 19 L 4 19 L 4 1 L 6 1 L 6 0 L 3 0 z M 8 0 L 8 1 L 9 1 L 9 0 L 8 0 z M 8 1 L 7 1 L 7 2 L 8 2 L 8 1 z M 8 2 L 8 3 L 9 3 L 9 2 L 8 2 z M 8 3 L 7 3 L 7 4 L 8 4 L 8 3 z M 8 4 L 8 5 L 9 5 L 9 4 L 8 4 z M 8 5 L 7 5 L 7 6 L 8 6 L 8 5 z M 8 6 L 8 7 L 9 7 L 9 6 L 8 6 z M 8 7 L 7 7 L 7 8 L 8 8 L 8 7 z M 8 8 L 8 9 L 9 9 L 9 8 L 8 8 z M 8 9 L 7 9 L 7 10 L 8 10 L 8 9 z M 13 1.3535156 L 15.646484 4 L 13 4 L 13 1.3535156 z M 7 11 L 6 15 L 6 18 L 10 18 L 10 15 L 9 11 L 7 11 z M 7 16 L 9 16 L 9 17 L 7 17 L 7 16 z " style="fill:#222222; fill-opacity:1; stroke:none; stroke-width:0px;"></path> </g> </g></svg>`,

  //default file image
  "default" : `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M7 0H2V16H14V7H7V0Z" fill="#000000"></path> <path d="M9 0V5H14L9 0Z" fill="#000000"></path> </g></svg>`
};

exports.showHomePage = async (req,res) => {
  res.locals.user = req.user; 

  if(req.isAuthenticated()){
    //Get Files
    const files = await db.getFilesByUser(req.user.id);

    if(files.length > 0){
      const filesWithIcons = files.map(file => ({
        ...file,
        icon: mimeTypeIcons[file.mimeType] || mimeTypeIcons["default"]
      }))
      res.locals.files = filesWithIcons;
    }
      
    //Get Folders
    const folders = await db.getFoldersByUser(req.user.id);

    if(folders.length > 0)
      res.locals.folders = folders;
  }

  res.render('index', {title: 'Express Template!'});
};

exports.showSignUp = (req,res) => {
  res.render('sign-up-form');
};

exports.SignUpPost = async (req,res, next) => {
  try{
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await db.createUser(req.body.first_name, req.body.username,hashedPassword);
    res.redirect("/");
  }
  catch(err){
    return next(err);
  }
};

exports.LogInPost = (req,res,next) => {
    passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/"
    })(req, res, next);
};

exports.LogOutGet = (req,res,next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

exports.uploadPost = (req,res,next) => {
    // req.file is the name of your file in the form above, here 'uploaded_file'
    // req.body will hold the text fields, if there were any
  //console.log("req.file: ", req.file);
  //console.log("req.body: ", req.body);
  db.createFile(req.file.filename,req.file.originalname,req.file.mimetype,req.file.size,req.file.path,req.user.id);
  res.redirect("/");
};

exports.getUserFiles = (req,res) => {
  const files = db.getFilesByUser(req.user.id);
  res.locals.files = files;
  res.render("displayFiles");
};

exports.getUserFolders = (req,res) => {
  const folders = db.getFoldersByUser(req.user.id);
  res.locals.folders = folders;
  res.render("displayFolders");
};

exports.CreateFolderPost = (req,res) => {
  db.createFolder(req.body.folder_name, req.user.id);
  res.redirect("/");
}

exports.CreateFolderGet = (req,res) => {
  res.render("createFolder");
}

exports.deleteFile = async (req,res) => {
  const file = await db.getFilebyFileId(req.params.fileId);

  if(file.userId === req.user.id){
    await db.deleteFileById(req.params.fileId);
  }else{
    res.sendStatus(401);
  }

  res.redirect("/");
}

exports.deleteFolder = async (req,res) => {
  const folder = await db.getFolderbyFolderId(req.params.folderId);

  if(folder.userId === req.user.id){
    await db.deleteFolderById(req.params.folderId);
  }else{
    res.sendStatus(401);
  }

  res.redirect("/");
}