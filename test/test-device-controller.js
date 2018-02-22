const request =  require('supertest'), 
app = require ('../src/app')

describe("# Device Controller #", function (){
    it("deve listar devices", function (done){
        request(app).get("/device").expect(200, done);
    })
});