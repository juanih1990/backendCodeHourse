import { expect } from 'chai'
import supertest from 'supertest'
import { faker } from '@faker-js/faker'

const requester = supertest('http://127.0.0.1:8080')
let cookie = null;


// TEST DE REGISTRO DE USUARIO
describe('Testing /api/session/register', () => {
    describe('Test prueba', () => {
        it('El endpoind /api/session/register debe registrar un usuario', async () => {
            const userTest = {
                firest_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                age: faker.datatype.number({ min: 18, max: 90 }),
                email: faker.internet.email(),
                password: faker.internet.password()
            }
            const response = await requester.post('/api/session/register').send(userTest)
            const { status, redirect, header, request } = response
            expect(request._data).to.have.property('firest_name')
            expect(status).to.equal(302)
            expect(redirect).to.be.true
            expect(header['location']).to.equal('/api/products/getProduct')
        })
    })
})
// TEST DE AGREGAR PRODUCTO; PARA ESO PRIMERO TIENE QUE LOGUEAR COMO ADMINISTRADOR 
describe('Testing /api/products', () => {

    describe('paso 1- El indepoint /api/products/addProduct debe crear un producto para esto', () => {

        const userAdmin = {
            email: 'admin',
            password: 'admin'
        }

        it('Primero el usaurio debe logear como administrador en /api/session/login y devolver una cookie', async () => {

            const response = await requester.post('/api/session/login').send(userAdmin)
            const cookieResult = response.header['set-cookie'][0]
            cookie = {
                name: cookieResult.split('=')[0],
                value: cookieResult.split('=')[1].split(';')[0]
            }
            expect(cookie.name).to.be.ok.and.eql('cookieJWT')
            expect(cookie.value).to.be.ok
            const { status, redirect, header, request } = response
            expect(status).to.equal(302)
            expect(request._data).to.have.property('email')
            expect(redirect).to.be.true
            expect(header['location']).to.equal('/api/products/getProduct')
        })
    })

    describe('paso 2- /api/products/addProduct debe crear un producto', () => {
        it('luego guardo el producto en la BD /api/products/addProduct', async () => {
            const productTesting = {
                title: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                price: faker.datatype.number({ min: 1, max: 99999 }),
                thumbnail: faker.internet.domainName(),
                code: faker.random.alphaNumeric(20),
                stock: faker.datatype.number({ min: 1, max: 99999 }),
                category: faker.commerce.department(),
            }
            const response = await requester.post('/api/products/addProduct').send(productTesting).set('Cookie', [`${cookie.name}=${cookie.value}`])
            const { status, redirect, header, request } = response
            expect(request._data).to.have.property('code')
            expect(redirect).to.be.false
            expect(status).to.equal(200)
        })
    })
})

//TEST PARA VER EL PERFIL DE USUARIO: PARA ESTO PRIMERO DEBE REGISTRAR UN USUARIO; LUEGO LOGUEAR Y POR ULTIMO PEDIR LOS DATOS DEL USUARIO LOGUEADO
describe('Testing /api/session/current ', () => {
    cookie = null; // Limpiar la cookie después de cada prueba
    let userAdminTest = {}
    describe(' El indepoint /api/session/current debe tener un usuario registrado para poder mostrar sus datos', async () => {
        const userTest = {
            firest_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            age: faker.datatype.number({ min: 18, max: 90 }),
            email: faker.internet.email(),
            password: faker.internet.password()
        }


        it('paso 1- El endpoind /api/session/register debe registrar un usuario', async () => {

            const response = await requester.post('/api/session/register').send(userTest)
            const { status, redirect, header, request } = response
            expect(request._data).to.have.property('firest_name')
            expect(status).to.equal(302)
            expect(redirect).to.be.true
            expect(header['location']).to.equal('/api/products/getProduct')
        })




        it('paso 2: el usaurio debe logear en /api/session/login y devolver una cookie', async () => {



            userAdminTest = {
                email: userTest.email,
                password: userTest.password
            }
            const response = await requester.post('/api/session/login').send(userAdminTest)
            const cookieResult = response.header['set-cookie'][0]
            cookie = {
                name: cookieResult.split('=')[0],
                value: cookieResult.split('=')[1].split(';')[0]
            }
            expect(cookie.name).to.be.ok.and.eql('cookieJWT')
            expect(cookie.value).to.be.ok
            const { status, redirect, header, request } = response
            expect(status).to.equal(302)
            expect(request._data).to.have.property('email')
            expect(redirect).to.be.true
            expect(header['location']).to.equal('/api/products/getProduct')
        })
    })

    describe('paso 3- muestro los datos del usuario', () => {

        it('luego muestro los datos del usauario en  /api/session/current', async () => {
            const response = await requester.get('/api/session/current').send(userAdminTest).set('Cookie', [`${cookie.name}=${cookie.value}`])
            const { status, redirect, header, request } = response
            console.log(request._data)
            expect(request._data).to.have.property('email')
            expect(redirect).to.be.false
            expect(status).to.equal(200)
        })
    })
})