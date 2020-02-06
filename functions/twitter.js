const Twit = require('twit');

module.exports.suspensionCheck = (config, data) => {
  const T = new Twit(config);

  return new Promise((resolve, reject) => {
    const date = new Date();
    const formattedDate = date.toLocaleDateString('en-AM', {
      day: '2-digit', month: 'short', year: 'numeric'
    });

    let unfollowedIds = data.storedData.user_id.filter(x => !data.newData.user_id.includes(x));

    if (unfollowedIds.length === 0) {
      reject(null); // No suspended or deleted accounts
    }
    let suspendedUsers = [];
    let deletedUsers = [];
    let i = 0;
    T.get('users/show', { user_id: unfollowedIds[i] }, function getData(err) {
      if (err) {
        if (err.code === 63) {
          suspendedUsers.push({
            screen_name: data.storedData.screen_name[data.storedData.user_id.indexOf(unfollowedIds[i])],
            profile_pic: data.storedData.profile_pic[data.storedData.user_id.indexOf(unfollowedIds[i])],
            date: formattedDate
          });
        } else if (err.code === 50) {
          deletedUsers.push({
            screen_name: data.storedData.screen_name[data.storedData.user_id.indexOf(unfollowedIds[i])],
            profile_pic: data.storedData.profile_pic[data.storedData.user_id.indexOf(unfollowedIds[i])],
            date: formattedDate
          });
        } else {
          reject(err);
        }
      }

      i++;
      if (i < unfollowedIds.length) {
        T.get('users/show', { user_id: unfollowedIds[i] }, getData);
      } else if (suspendedUsers.length > 0 || deletedUsers.length > 0) {
        resolve({ suspended: suspendedUsers, deleted: deletedUsers });
      } else {
        reject(null); // No suspended or deleted accounts
      }
    })
  })
};

module.exports.storeNames = (config, params) => {
  const T = new Twit(config);

  return new Promise((resolve, reject) => {
    getFriends(params, T).then((data) => {
      let dataChunk = data.chunk(100);
      let i = 0;
      let friendNamesPics = { screen_name: [], profile_pic: [], user_id: data };
      T.get('users/lookup', { user_id: dataChunk[i].join(',') }, function getData(err, dat) {
        if (err) {
          reject(err);
        } else {
          friendNamesPics.screen_name.push(...dat.map(({ screen_name }) => screen_name));
          friendNamesPics.profile_pic.push(...dat.map(({ profile_image_url_https }) => getLargePic(profile_image_url_https)));
          i++;
          if (i < dataChunk.length) {
            T.get('users/lookup', { user_id: dataChunk[i].join(',') }, getData)
          } else {
            resolve(friendNamesPics)
          }
        }
      })
    }).catch((err) => {
      console.log(err);
      reject(err);
    });
  })
};

module.exports.verifyUser = (config) => {
  const T = new Twit(config);

  return new Promise((resolve, reject) => {
    T.get('account/verify_credentials', { skip_status: true, include_entities: false })
      .then((data) => {
        if (data.resp.statusCode === 200 && !data.data.suspended) {
          resolve({
            user_id: data.data.id_str,
            name: data.data.name,
            screen_name: data.data.screen_name,
            friends_count: numberWithCommas(data.data.friends_count),
            profile_pic: getLargePic(data.data.profile_image_url_https),
            profile_banner: data.data.profile_banner_url,
            statusCode: 200
          })
        } else {
          reject('something wrong (suspended or failed request)')
        }
      })
      .catch((err) => {
        reject(err);
      })
  })
};

module.exports.invalidateToken = (config) => {
  const T = new Twit(config);

  return new Promise((resolve, reject) => {
    T.post('oauth/invalidate_token')
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err)
      })
  })
};

getFriends = (params, twit, friendIDs = []) => {

  return new Promise((resolve, reject) => {
    twit.get('friends/ids', {
      user_id: params.user_id,
      stringify_ids: true
    }, function getData(err, data, response) {
      if (err) {
        reject(err);
      } else {
        friendIDs.push(...data.ids);
        if (data['next_cursor'] > 0) {
          twit.get('friends/ids', {
            user_id: params.user_id,
            stringify_ids: true,
            cursor: data['next_cursor']
          }, getData);
        } else {
          resolve(friendIDs);
        }
      }
    })
  })
};

function numberWithCommas(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getLargePic(picURL) {
  const splitURL = picURL.split('_normal.');
  return `${splitURL[0]}_400x400.${splitURL[1]}`
}


Object.defineProperty(Array.prototype, 'chunk', {
  value: function (chunkSize) {
    const idArray = [];
    for (let i = 0; i < this.length; i += chunkSize)
      idArray.push(this.slice(i, i + chunkSize));
    return idArray;
  }
});

/*storeSuspended = function (array1, array2) { // array1 is stored names/pics, array2 is new names/pics
    const T = new Twit(config);
    return new Promise((resolve, reject) => {
        let unfollowedNames = array1[0].filter(x => !array2[0].includes(x));
        let suspendedNamesPics = [[],[]];
        console.log(unfollowedNames);
        for (let i = 0; i < unfollowedNames.length; i++) {
            suspensionCheck({screen_name: unfollowedNames[i]}, T).then((data) => {
                suspendedNamesPics[0].push(data);
                suspendedNamesPics[1].push(array1[1][array1[0].indexOf(data)]);

            }).catch((err) => {
                if (err === null) {
                    console.log('Not suspended');
                } else {
                    console.log(err);
                }
            });
        }
        console.log(suspendedNamesPics);
        if (suspendedNamesPics[0].length > 0) {
            //console.log('Suspended accounts are: %s', suspendedNames);
            resolve(suspendedNamesPics);
        }
        else {
            reject("No suspended accounts");
        }
    });
};*/

/*const findDuplicates = (arr) => {
    let sorted_arr = arr.slice().sort(); // You can define the comparing function here.
    // JS by default uses a crappy string compare.
    // (we use slice to clone the array so the
    // original array won't be modified)
    let results = [];
    for (let i = 0; i < sorted_arr.length - 1; i++) {
        if (sorted_arr[i + 1] == sorted_arr[i]) {
            results.push(sorted_arr[i]);
        }
    }
    return results;
};*/

// sincoscoscostan
// onlinehime

/*function hasDuplicates(array) {
    return (new Set(array)).size !== array.length;
}*/
/*getFriends({screen_name: 'WorldAndScience'}).then((data)  => {
    console.log(data);
}).catch((err) => {
    console.log(err);
});*/

/*storeNames({screen_name: 'name'}).then((data) => {
    console.log(data);
    return data
}).catch((err) => {s
    console.log(err)
});*/
