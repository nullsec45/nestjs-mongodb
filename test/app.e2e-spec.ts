import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
// import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import mongoose, { mongo } from 'mongoose';
import { Category } from 'src/book/schemas/book.schema';

describe('Book & Auth Controller (e2e)', () => {
  
  let app: INestApplication;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });
  
  beforeAll(async () => {
    await mongoose.connect(process.env.DB_URI);
    await mongoose.connection.db.dropDatabase();
  });

  afterAll(() => mongoose.disconnect());
 
  const mockUser={
        // _id:'690612d0a60580a8b3d82663',
        name: 'fajar',
        email: 'fajar@example.com',
        password:'12345678'
  };

  const mockBook={
      title:'New Book',
      description:'Book Description',
      author:'Author',
      price:100000,
      category:Category.FANTASY,
  }

  let jwtToken:string='';
  let bookCreated:any=null;

  describe('Auth', () => {
      it('(POST) - Register a New User', () => {
          return request(app.getHttpServer())
            .post('/auth/signup')
            .send(mockUser)
            .expect(201)
            .then((res) => {
                expect(res.body.token).toBeDefined();
            });
      });

      it('(POST) - Login User', () => {
        const loginDto={
              email:mockUser.email,
              password:mockUser.password,
          };

          return request(app.getHttpServer())
            .post('/auth/signin')
            .send(loginDto)
            .expect(201)
            .then((res) => {
                expect(res.body.token).toBeDefined();
                jwtToken=res.body.token;
            });
      });
  });

  describe('Book', () => {
    it('(POST) - Create New Book', async() => {
        return request(app.getHttpServer())
          .post('/books')
          .set('Authorization', `Bearer ${jwtToken}`)
          .send(mockBook)
          .expect(201)
          .then((res) => {
              expect(res.body._id).toBeDefined();
              expect(res.body.title).toEqual(mockBook.title); 
              bookCreated=res.body;
          })
    });
  })

  it('(GET) - Get all Books', async () => {
      return request(app.getHttpServer())
        .get('/books')
        .expect(200)
        .then((res) => {
          expect(res.body.length).toBe(1);
        });
    });

    it('(GET) - Get a Book by ID', async () => {
      return request(app.getHttpServer())
        .get(`/books/${bookCreated?._id}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body._id).toEqual(bookCreated._id);
        });
    });

    it('(PUT) - Update a Book by ID', async () => {
      const book = { title: 'Updated name' };
      return request(app.getHttpServer())
        .put(`/books/${bookCreated?._id}`)
        .set('Authorization', 'Bearer ' + jwtToken)
        .send(book)
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.title).toEqual(book.title);
        });
    });

    it('(DELETE) - Delete a Book by ID', async () => {
      return request(app.getHttpServer())
        .delete(`/books/${bookCreated?._id}`)
        .set('Authorization', 'Bearer ' + jwtToken)
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.deleted).toEqual(true);
        });
    });
});
