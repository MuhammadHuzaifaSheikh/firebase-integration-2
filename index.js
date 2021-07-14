console.log("welcomee");

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
let firebaseConfig = {
    apiKey: "AIzaSyAwaih_asdp7O8-EQc2P1v4uCHZsN5CqYs",
    authDomain: "erfad-cffb6.firebaseapp.com",
    projectId: "erfad-cffb6",
    storageBucket: "erfad-cffb6.appspot.com",
    messagingSenderId: "205991254741",
    appId: "1:205991254741:web:0dfb39f60e28415ea6205c",
    measurementId: "G-DKSJ0C842B",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
let db = firebase.firestore();


let bookImageUploadUrl = ''


const username = document.getElementById("username-signup");
const email = document.getElementById("email");
const password = document.getElementById("password");
const signInUsername = document.getElementById("signup-btn");
// TODO update these
const userNameSignIn = document.getElementById("username_signIn")
const passwordSignIn = document.getElementById("username_password")


function navigation(path) {
    if (localStorage.getItem('uid')) {
        window.location.replace(path)
    } else {
        window.location.replace('sign-in.html')
    }
}


firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        console.log("logged in")
        // ...
    } else {
        // User is signed out
        // ...
        localStorage.removeItem('uid')
        console.log("logged out");
    }
});

function signOut() {
    localStorage.removeItem('uid');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('productDetailInfoId');
    localStorage.removeItem('bookId');
    localStorage.removeItem('orderId');
    window.location.replace("./index.html")

}

function signUp() {
    console.log(username.value);
    console.log(email.value);
    console.log(password.value);

    firebase
        .auth()
        .createUserWithEmailAndPassword(email.value, password.value)
        .then((e) => {
            console.log("works");
            console.log(e.log);
            add('user', {admin: false, email: email.value, username: username.value, uid: e.user.uid, rating: 0})
            username.value = ''
            email.value = ''
            password.value = ''

            swal('User Registered Successfully');
        })
        .catch((e) => {
            console.log({e});
            console.log(e);
            swal(e.message)
        });
}

// Call this function to sign in the user
function signIn(e) {
    console.log(userNameSignIn);
    firebase.auth().signInWithEmailAndPassword(userNameSignIn.value, passwordSignIn.value).then(e => {
        console.log(e);
        localStorage.setItem('uid', e.user.uid)
        userNameSignIn.value = ''
        passwordSignIn.value = ''

        navigateProfile()
    }).catch((e) => swal(e.message))

}

function navigateProfile() {
    if (localStorage.getItem('uid')) {
        db.collection("user").where("uid", "==", localStorage.getItem('uid'))
            .get().then((querySnapShot) => querySnapShot.forEach((doc) => {
            if (doc.data().admin) {
                if (localStorage.getItem('uid')) {
                    window.location.replace("./profile-Admin.html")
                } else {
                    window.location.replace('sign-in.html')
                }
            } else {
                if (localStorage.getItem('uid')) {
                    window.location.replace("./profile%20page.html")
                } else {
                    window.location.replace('sign-in.html')
                }
            }

        }))
    } else window.location.replace('sign-in.html')
}


function add(collectionName, data) {
    return new Promise(function (resolve, reject) {

        db.collection(collectionName).add(data)
            .then((docRef) => {
                console.log("Document written with ID: ", docRef.id);
                resolve(docRef.id)
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
                reject(error)
            });
    })

}

// profile
let profileUsername = document.getElementById('profile-username');
let profileEmail = document.getElementById('profile-email');

function getUserInfo() {
    document.querySelector('.profile>h1').innerHTML = 'Profile  Loading......'
    db.collection("user").where("uid", "==", localStorage.getItem('uid'))
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                document.querySelector('.profile>h1').innerHTML = 'Profile';
                profileUsername.value = doc.data().username;
                console.log(doc.id);
                currentUserId = doc.id;
                localStorage.setItem('currentUser', doc.id)
                db.collection("user").doc(doc.id).update({id: doc.id}).then(() => console.log('add id'))
                profileEmail.value = doc.data().email;
                document.querySelector('.rating-number').innerHTML = doc.data().rating;

            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });

}

function loaadHomePage() {
    if (!localStorage.getItem('currentUser')) {
        document.querySelector('.dropdown-toggle').style.display = "none";
    }
}

function editUser(e) {
    if (profileUsername.value === '') {
        swal('Username cannot be blank');
    } else {
        db.collection("user").doc(localStorage.getItem('currentUser')).update({username: profileUsername.value}).then(() => {
            swal('Username updated successfully');
            getUserInfo()
        })


    }
}

// add book
async function addBook() {
    if (!localStorage.getItem('currentUser')) {
        document.querySelector('.dropdown-toggle').style.display = "none";
    }
    let bookTitle = document.querySelector('.book-title');
    let bookName = document.querySelector('.book-name');
    let bookVersion = document.querySelector('.book-version');
    let yearPublish = document.querySelector('.year-publish');
    let department = document.querySelector('.department');
    let status = document.querySelector('.status');
    let description = document.querySelector('.description');
    let price = document.querySelector('.price');
    if (!bookImageUploadUrl || !bookTitle.value || !bookName.value || !bookVersion.value || !yearPublish.value || !department.value || !status.value || !description.value || !price.value) {
        swal('Some fields are missing');
    } else if (localStorage.getItem('currentUser')) {
        let data = {
            bookTitle: bookTitle.value,
            bookName: bookName.value,
            bookVersion: bookVersion.value,
            yearPublish: yearPublish.value,
            department: department.value,
            status: status.value,
            description: description.value,
            price: price.value,
            bookId: bookName.value.replace(/\s+/g, '') + bookVersion.value + Math.floor(Math.random() * 5000),
            ownerId: localStorage.getItem('currentUser'),
            imageUrl: bookImageUploadUrl,
            sold: false,

        }
        let addBooks = await add('books', data);
        console.log(addBooks);
        bookTitle.value = ''
        bookName.value = ''
        bookVersion.value = ''
        yearPublish.value = ''
        department.value = ''
        status.value = ''
        yearPublish.value = ''
        description.value = ''
        imageUrl = ''

        document.querySelector('.book-image').src = ''
        swal('Book has published successfully');


    } else window.location.replace("./sign-in.html")
    // else  window.location.replace("./sign-in.html")


}

const loadFile = function (event) {
    let img = document.querySelector('.book-image')
    if (event.target.files[0]) {
        let reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = function () {
            img.src = reader.result
            bookImageUploadUrl = reader.result;
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    }

};


// my books

function MyBooks() {
    if (!localStorage.getItem('currentUser')) {
        document.querySelector('.dropdown-toggle').style.display = "none";
    }
    let newdiv;
    let myBooksContainer = document.querySelector('.my-books-card');
    let loading = `
    <div class="text-center loading mb-5 mt-5">
  <div class="spinner-border" role="status">
    <span class="sr-only">Loading...</span>
  </div>
</div>
    `
    myBooksContainer.innerHTML = loading
    db.collection("books").where("ownerId", "==", localStorage.getItem('currentUser'))
        .get()
        .then((querySnapshot) => {
            myBooksContainer.removeChild(myBooksContainer.querySelector('.loading'))
            querySnapshot.forEach((doc) => {
                newdiv = document.createElement('div');
                newdiv.innerHTML = `
             <div class="card mt-5" style="width: 18rem;">
  <img class="card-img-top" src='${doc.data().imageUrl}'   alt="Card image cap">
  <div class="card-body">
    <h5 class="card-title">${doc.data().bookTitle}</h5>
    <h5 class="card-title">${doc.data().bookName}</h5>
    <p class="card-text">${doc.data().description}</p>
    <a href="#" class="btn btn-danger bookDeleteBtn">Delete</a>
  </div>
</div>
             `
                newdiv.className= 'col-md-4'

                myBooksContainer.appendChild(newdiv);

                newdiv.querySelector('.bookDeleteBtn').onclick = function () {
                    return deleteBooks(doc.id);
                };
            })
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
}

function deleteBooks(id) {
    db.collection("books").doc(id).delete().then(() => {
        swal('Successfully deleted');
        window.location.reload()
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
}

function deleteBookFromBookDetail() {
    db.collection("books").where("bookId","==",localStorage.getItem("bookId")).get().then((querySnapShot)=>querySnapShot.forEach((doc)=>{
        db.collection("books").doc(doc.id).delete().then(() => {
            swal('Successfully deleted');
            navigation('index.html')
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    }))
}

// books page "Physics,Math,Chemistry" etc


function booksLoad(department) {
    if (!localStorage.getItem('currentUser')) {
        document.querySelector('.dropdown-toggle').style.display = "none";
    }
    localStorage.removeItem('productDetailInfoId');
    localStorage.removeItem('productDetailInfoDepartment');
    let newdiv;
    let myBooksContainer = document.querySelector(`.${department}_card`);
    let loading = `
    <div class="text-center loading mb-5 mt-5">
  <div class="spinner-border" role="status">
    <span class="sr-only">Loading...</span>
  </div>
</div>
    `
    myBooksContainer.innerHTML = loading

    db.collection("books").where("department", "==", department).where("sold", "==", false)
        .get()
        .then((querySnapshot) => {
            myBooksContainer.removeChild(myBooksContainer.querySelector('.loading'))

            querySnapshot.forEach((doc) => {
                console.log(doc.id, doc.data());
                productDetailId = doc.id
                newdiv = document.createElement('div');
                newdiv.className= 'col-md-4'
                newdiv.innerHTML = `
             <div  class="card mt-5 card-hover" style="width: 18rem;">
                <img class="card-img-top" src='${doc.data().imageUrl}'  alt="Card image cap">
                <h3 >${doc.data().bookTitle}</h3>
             </div>
             `
                myBooksContainer.appendChild(newdiv);
                newdiv.onclick = function () {
                    return productDetailNavigation(doc.id, department);
                };

            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
}

//product detail


function productDetailNavigation(id, department) {
    localStorage.setItem('productDetailInfoId', id);
    localStorage.setItem('productDetailInfoDepartment', department);

    db.collection("books").doc(id).get().then((doc) => {
        if (doc.data().ownerId === localStorage.getItem('currentUser')) navigation('Book%20info%20-%20admin.html');
        else window.location.replace('Book%20info%20-%20student.html')
    })
}

function productDetail() {

    document.querySelector('.book-info-path').innerHTML = `Homepage / ${localStorage.getItem('productDetailInfoDepartment')} `

    db.collection("books").doc(localStorage.getItem('productDetailInfoId'))
        .get().then((doc) => {

        if (doc.exists) {
            let data = doc.data()
            db.collection("user").doc(data.ownerId).get().then((sellerData) => {
                document.querySelector('.seller-name').innerHTML = sellerData.data().username;
                document.querySelector('.book-name').innerHTML = data.bookName;
                document.querySelector('.description').innerHTML = data.description;
                document.querySelector('.status').innerHTML = data.status;
                document.querySelector('.version').innerHTML = data.bookVersion;
                document.querySelector('.year-publish').innerHTML = new Date(data.yearPublish).getFullYear();
                document.querySelector('.price').innerHTML = data.price;
                document.querySelector('.book-image').src = data.imageUrl;
            })

            localStorage.setItem('bookId', data.bookId)


        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });


}

// report page load
function reportBookOnLoad() {
    if (!localStorage.getItem('currentUser')) {
        document.querySelector('.dropdown-toggle').style.display = "none";
    }
    let bookId = document.querySelector('.book-id');
    bookId.value = localStorage.getItem('bookId');
    bookId.disabled = true

}

let reportButton = document.querySelector('.report-button');
let reason = document.querySelector('.reason');
let comments = document.querySelector('.comments');

// go to send report progress
function sendReport() {
    console.log('click');
    if (reason.value === '' || comments.value === '') swal('Some fields are missing');
    else {

        let loading = `
    <div class="text-center loading">
  <div class="spinner-border" role="status">
    <span class="sr-only">Loading...</span>
  </div>
</div>
    `
        reportButton.innerHTML = loading

        let docRef = db.collection("reports").where('bookId', '==', localStorage.getItem('bookId')).where("reporterId", "==", localStorage.getItem('currentUser'));

        docRef.get().then((querySnapShot) => {
            console.log(querySnapShot.docs.length);
            if (querySnapShot.docs.length < 1) {
                if (localStorage.getItem('currentUser')) {
                    addReport()
                } else window.location.replace('sign-in.html')

            } else {
                querySnapShot.forEach((doc) => {
                    console.log('reporterId', doc.data().reporterId === localStorage.getItem('currentUser'));
                    console.log(doc.data());
                    swal('Sorry, You have already reported this book')
                    reportButton.innerHTML = 'Report'

                })
            }
        }).catch((error) => swal("Error getting document:", error.message));

    }


}

// add report onclick database

function addReport() {
    if (!localStorage.getItem('currentUser')) {
        document.querySelector('.dropdown-toggle').style.display = "none";
    }
    let loading = `
    <div class="text-center loading mb-5 mt-5">
  <div class="spinner-border" role="status">
    <span class="sr-only">Loading...</span>
  </div>
</div>
    `
    db.collection("books").where('bookId', '==', localStorage.getItem('bookId')).get().then((querySnapShot) => {
        querySnapShot.forEach(async (doc) => {
            let ownerId = doc.data().ownerId;
            if (ownerId === localStorage.getItem('currentUser')) {
                swal('You are already owner of this book');
            } else {
                try {
                    let res = await add('reports', {
                        reason: reason.value,
                        comments: comments.value,
                        bookId: localStorage.getItem('bookId'),
                        ownerId,
                        reporterId: localStorage.getItem('currentUser')
                    })
                    console.log(res);
                    swal('Report send successfully');
                    reportButton.innerHTML = 'Report'
                } catch (e) {
                    console.log(e.message);
                }
            }


        })
    })
}

// my reports
function myReports() {
    if (!localStorage.getItem('currentUser')) {
        document.querySelector('.dropdown-toggle').style.display = "none";
    }
    let newdiv;
    let myReportsContainer = document.querySelector(`.my-reports-container`);
    let loading = `
    <div class="text-center loading mb-5 mt-5">
  <div class="spinner-border" role="status">
    <span class="sr-only">Loading...</span>
  </div>
</div>
    `
    myReportsContainer.innerHTML = loading
    db.collection("user").where("uid", "==", localStorage.getItem('uid'))
        .get().then((querySnapShot) => querySnapShot.forEach((doc) => {
        if (doc.data().admin) {
            db.collection("reports")
                .get()
                .then((querySnapshot) => {
                    myReportsContainer.removeChild(myReportsContainer.querySelector('.loading'))
                    let i = 1
                    querySnapshot.forEach((doc) => {
                        console.log(doc.id, doc.data(),);
                        let data = doc.data()
                        newdiv = document.createElement('div');
                        newdiv.innerHTML = `
              <div class= "reportadminrectangles">
                    <p class = "reportadminh5" >Report #${i++}:</p>
                    <p class="ptextrectangles">BookID:&nbsp;<span class="spantextinsiderectangles">${data.bookId}</span></p>
                    <p class="ptextrectangles">Reason:&nbsp;<span class="spantextinsiderectangles">${data.reason}.</span></p>
                    <p class="ptextrectangles">Comments:&nbsp;<span class="spantextinsiderectangles">${data.comments}.</span></p>
                    <a href="#" class="btn btn-sm btn-danger pull-right deleteReport">Delete</a>
                </div>
                <br>
             `
                        myReportsContainer.appendChild(newdiv);
                        newdiv.querySelector('.deleteReport').onclick = function () {
                            return deleteReports(doc.id);
                        };
                    });
                })
                .catch((error) => {
                    console.log("Error getting documents: ", error);
                });
        } else {
            db.collection("reports").where("ownerId", "==", localStorage.getItem('currentUser'))
                .get()
                .then((querySnapshot) => {
                    myReportsContainer.removeChild(myReportsContainer.querySelector('.loading'))
                    let i = 1
                    querySnapshot.forEach((doc) => {
                        console.log(doc.id, doc.data(),);
                        let data = doc.data()
                        newdiv = document.createElement('div');
                        newdiv.innerHTML = `
              <div class= "reportadminrectangles">
                    <p class = "reportadminh5" >Report #${i++}:</p>
                    <p class="ptextrectangles">BookID:&nbsp;<span class="spantextinsiderectangles">${data.bookId}</span></p>
                    <p class="ptextrectangles">Reason:&nbsp;<span class="spantextinsiderectangles">${data.reason}.</span></p>
                    <p class="ptextrectangles">Comments:&nbsp;<span class="spantextinsiderectangles">${data.comments}.</span></p>
                    <a href="#" class="btn btn-sm btn-danger pull-right deleteReport">Delete</a>
                </div>
                <br>
             `
                        myReportsContainer.appendChild(newdiv);
                        newdiv.querySelector('.deleteReport').onclick = function () {
                            return deleteReports(doc.id);
                        };
                    });
                })
                .catch((error) => {
                    console.log("Error getting documents: ", error);
                });
        }

    }))


}


function deleteReports(id) {
    db.collection("reports").doc(id).delete().then(() => {
        swal('Successfully deleted');
        window.location.reload()
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
}

// order place onclick
function orderPlace() {

    if (!localStorage.getItem('currentUser')){
        window.location.replace('sign-in.html')
    }
    else {

        let loading = `
    <div class="text-center loading">
  <div class="spinner-border" role="status">
    <span class="sr-only">Loading...</span>
  </div>
</div>`

        let orderPlaceBtn = document.querySelector('.orderPlaceBtn');
        let rateBtn = document.querySelector('.rateBtn');
        orderPlaceBtn.innerHTML = loading
        db.collection("books").where("bookId", "==", localStorage.getItem('bookId'))
            .get().then((querySnapShot) => {
            querySnapShot.forEach(async (doc) => {
                let data = doc.data();

                if(data.sold){
                    swal("This book is already sold out")
                    orderPlaceBtn.innerHTML = 'Back'
                    orderPlaceBtn.onclick = function () {
                        navigation('index.html');
                    }


                }
                else {
                    let orderData = {
                        bookId: data.bookId,
                        buyerId: localStorage.getItem('currentUser'),
                        sellerId: data.ownerId,
                        imageUrl: data.imageUrl,
                    }
                    try {
                        let addOrder = await add('order', orderData);
                        console.log(addOrder);
                        orderPlaceBtn.innerHTML = 'Order Placed'
                        // updated book to sold
                        db.collection("books").doc(doc.id).update({sold: true}).then(() => console.log('successfully edit'))
                        localStorage.setItem('orderId', addOrder)

                        orderPlaceBtn.innerHTML = "Order Delivered";
                        rateBtn.style.display = "inline-block";

                        orderPlaceBtn.onclick = function () {
                            navigation('OrderDetails.html');
                        }

                    } catch (e) {
                        swal(e.message)
                    }
                }


            })
        })
    }
}

// order detail
function orderDetail() {
    db.collection("order").doc(localStorage.getItem('orderId')).get()
        .then((doc) => {
            console.log(doc.id, doc.data());
            document.querySelector('.orderId').innerHTML = `Order #${doc.id}`

            db.collection("books").where("bookId", "==", doc.data().bookId).get().then((querySnapShot) => querySnapShot.forEach((doc) => document.querySelector('.orderBookName').innerHTML = doc.data().bookName))
            db.collection("user").doc(doc.data().sellerId).get().then((doc) => {
                document.querySelector('.orderSellerName').innerHTML = doc.data().username
                document.querySelector('.orderSellerEmail').innerHTML = doc.data().email
            })

        }).catch((e) => swal(e.message))
}


// rating

function myOrder() {
    let newdiv;
    let myOrderContainer = document.querySelector(`.recContainer`);
    let loading = `
    <div class="text-center loading mb-5 mt-5">
  <div class="spinner-border" role="status">
    <span class="sr-only">Loading...</span>
  </div>
</div>
    `
    myOrderContainer.innerHTML = loading
    db.collection("order").where("buyerId", "==", localStorage.getItem('currentUser'))
        .get()
        .then((querySnapshot) => {
            myOrderContainer.removeChild(myOrderContainer.querySelector('.loading'))

            let i = 0
            querySnapshot.forEach((doc) => {
                console.log(doc.id, doc.data());


                productDetailId = doc.id
                newdiv = document.createElement('div');
                newdiv.innerHTML = `
              <img  width="200"  alt="" src="${doc.data().imageUrl}" class="orderImage m-5">
              <div class="card-body">
                <h5 class="card-title">ORDER #${++i}</h5>
                <p class="card-text">Order Status:In progress</p>
                <button  class="btn btn-info orderDetailBtn" type="submit">Order Details</button>    
               </div>

             `

                myOrderContainer.appendChild(newdiv);
                newdiv.querySelector('.orderDetailBtn').onclick = function () {
                    return processToOrderDetailPage(doc.id);
                };
            });
        })
        .catch((error) => {
            swal("Error getting documents: ", error.message);
        });
}
function goToRatingPage() {
    navigation('rating%20.html')
}

function submitRating() {
    let loading = `
    <div class="text-center loading mb-5 mt-5">
  <div class="spinner-border" role="status">
    <span class="sr-only">Loading...</span>
  </div>
</div>
    `
     let ratingSubmitBtn = document.querySelector('.ratingSubmitBtn')
    ratingSubmitBtn.innerHTML= loading;
    db.collection("order").doc(localStorage.getItem('orderId')).get().then((doc)=> {
        let sellerId = doc.data().sellerId
        db.collection("user").doc(sellerId).get().then((doc)=>{
           let previousRating = doc.data().rating;
            let newRating=   document.querySelector('input[name="rate"]:checked').value;
            if (previousRating===0){
                let totalRating = Number(newRating);
                console.log('totalRating',totalRating);
                db.collection("user").doc(sellerId).update({rating: totalRating}).then(() => {
                    swal('Rating successfully submited ')
                    navigation('OrderDetails.html')

                });
            }
            else {
                let plusRating = Number(previousRating)+Number(newRating);
                let totalRating= plusRating/2
                console.log('totalRating',totalRating);
                swal('Rating successfully submited ')
                db.collection("user").doc(sellerId).update({rating: totalRating}).then(() => {
                swal('Rating successfully submited ');
                    navigation('OrderDetails.html')

                });

            }


        })


    })
}
function skipRating() {
    navigation('OrderDetails.html')
}


// processToOrderDetailPage this function is used to save order detail id and navigate to order detail page
function processToOrderDetailPage(id) {
    localStorage.setItem('orderId', id)
    navigation('OrderDetails.html')
}

// this functions runs when the manageUserPage loads
function manageUserPageLoad() {
    if (!localStorage.getItem('currentUser')) {
        document.querySelector('.dropdown-toggle').style.display = "none";
    }

    let tbody = document.querySelector('.manageUser-tbody');
    let i = 0;

    db.collection("user").get().then((querySnapShot) => querySnapShot.forEach((doc) => {
        let newTr = document.createElement('tr');
        newTr.innerHTML = `
        <th scope="row">${++i}</th>
                    <td>${doc.data().username}</td>
                    <td>
                        <label>
                            <select class="custom-select manageUserSelect" style="width: 150px;">
                                <option class="studentOption"> Student</option>
                                <option class="adminOption"> Admin</option>
                            </select>
                        </label>
                    </td>
                    <td><button type="button" class="btn btn-dark deleteUserBtn">Delete</button></td>
        `
        tbody.appendChild(newTr)
        if (doc.data().admin) newTr.querySelector('.adminOption').setAttribute('selected', 'selected');
        newTr.querySelector('.deleteUserBtn').onclick = function () {
            return deleteUser(doc.id);
        };
        newTr.querySelector('.manageUserSelect').onchange = function (e) {
            return changeRole(doc.id, e.target.value);
        };

    }))
}

function deleteUser(id) {
    db.collection("user").doc(id).delete().then(() => {
        swal('Successfully deleted user');
        window.location.reload()
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
}

// this function use to change user to admin and admin to user
function changeRole(id, role) {
    console.log(id, role);
    db.collection("user").doc(id).update({admin: role === 'Admin'}).then(() => {
        swal("User successfully updated!");
    });
}


