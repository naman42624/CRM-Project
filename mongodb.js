// CRUD

// const mongoose = require('mongoose');
// const mongodb = require('mongodb');
// // give ascess
// const MongoClient = mongodb.MongoClient;
// const ObjectId = mongodb.ObjectID
// OR
const {MongoClient, ObjectID} = require('mongodb')
// local server running
// const url = 'mongodb://localhost:27017';
const url = 'mongodb://127.0.0.1:27017'
const dbName = 'task-manager';
MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');
    const db = client.db(dbName);
    db.collection('users').updateOne({
        _id: new ObjectID('62ac5e45d6ff6b419942e0ca')
    },{
        $set: {
            name: 'John'
        }
    }).then((result) => {
        console.log(result);
    }).catch((err) => {
        console.log(err);
    })
    db.collection('tasks').updateMany({
        completed: false
    },{
        $set:{
            completed: true
        }
    }).then((result) => {
        console.log(result);
    }).catch((err) => {
        console.log(err);
    })
    db.collection('tasks').deleteOne({_id: new ObjectID('62ac6c6e246b8c8475d9fb69')}).then((result) => {
        console.log(result);
    }).catch((err) => {
        console.log(err);
    })

    // db.collection('users').findOne({age: 85}, (err, result) => {
    //     if (err) {
    //         return console.log('Unable to fetch', err);
    //     }
    //     console.log(result);
    // })
    // db.collection('users').find({age: 21}).toArray((err, result) => {
    //     if (err) {
    //         return console.log('Unable to fetch', err);
    //     }
    //     console.log(result);

    // })
    // db.collection('users').find({age: 21}).count((err, count) => {
    //     if (err) {
    //         return console.log('Unable to fetch', err);
    //     }
    //     console.log(count);
        
    // })
    // db.collection('tasks').findOne({_id: new ObjectID("62ac6c6e246b8c8475d9fb6a")}, (err, result) => {
    //     if (err) {
    //         return console.log('Unable to fetch', err);
    //     }
    //     console.log(result);
    // })
    // db.collection('tasks').find({completed: false}).toArray((err, result) => {
    //     if (err) {
    //         return console.log('Unable to fetch', err);
    //     }
    //     console.log(result);

    // })


    
    // db.collection('users').insertOne({
    //     name: 'Naman',
    //     age: 21
    // }, (err, result)=>{
    //     if(err){
    //         return console.log('Unable to insert')
    //     }
    //     console.log(result)
    // })
    // db.collection('users').insertMany([
    //     {
    //         name: 'Naman',
    //         age: 25
    //     },
    //     {
    //         name: 'saw',
    //         age:85
    //     }
    // ],(err, result)=>{
    //         if(err){
    //             return console.log('Unable to insert')
    //         }
    //         console.log(result)
    // })
    // db.collection('users').insertOne({
    //     name: 'Andrew',
    //     age: 27
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Unable to insert user', err);
    //     }

    //     console.log(result.ops);
    // });

    // db.collection('users').insertMany([
    //     {
    //         name: 'Jen',
    //         age: 26
    //     },
    //     {
    //         name: 'Gunther',
    //         age: 27
    //     }
    // ], (err, result) => {
    //     if (err) {
    //         return console.log('Unable to insert users', err);
    //     }

    //     console.log(result.ops);
    // });

    // db.collection('tasks').insertMany([
    //     {
    //         description: 'Clean the house',
    //         completed: true
    //     },
    //     {
    //         description: 'Renew inspection',
    //         completed: false
    //     },
    //     {
    //         description: 'Buy groceries',
    //         completed: true
    //     }
    // ], (err, result) => {
    //     if (err) {
    //         return console.log('Unable to insert tasks', err);
    //     }

    //     console.log(result.ops);
    // });

    // db.collection('users').findOne({ name: 'Gunther' }, (err, user) => {
    //     if (err) {
    //         return console.log('Unable to fetch', err);
    //     }

    //     console.log(user);
    // });

    // db.collection('users').find({ age: 27 }).
    // db.collection('tasks').insertMany([
    //     {
    //         description: 'des1',
    //         completed: true
    //     },
    //     {
    //         description: 'des2',
    //         completed: false
    //     },
    //     {
    //         description: 'des4',
    //         completed: true
    //     }
    // ],(err,result)=>{
    //     if(err){
    //         return console.log('Unable to insert')
    //     }
    //     console.log(result)
    // })
})