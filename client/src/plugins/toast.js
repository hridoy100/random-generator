import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"

const commonConfig = {
    newWindow: true,
    close: true,
    gravity: 'top',
    position: 'right',
    stopOnFocus: true,
    duration: 5000
}

export const successToast = (message) =>
    Toastify({
        text: message,
        backgroundColor: '#0B875B',
        ...commonConfig
    })
export const errorToast = (message) =>
    Toastify({
        text: message || "Something went wrong. Please try again after some time.",
        backgroundColor: '#E13C3C',
        ...commonConfig
    })