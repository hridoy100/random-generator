import http from './http-common'

class GeneratorService{
    generate(){
        return http.get('/generate');
    }

    report(){
        return http.get('/report');
    }
}


export default new GeneratorService()