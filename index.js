#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const request = require('request');
const tumblr = require('tumblr.js');
const minimist = require('minimist');
const ProgressBar = require('progress');

var argv = minimist(process.argv.slice(2));

mkdirp(argv.d || 'downloaded', err => {
    if (err) console.error(err);
});

var cred = require(process.env.TUMBLR_CREDS ||
    process.env.HOME + '/tumblr_credentials.json');

var client = new tumblr.Client({
    credentials: {
        consumer_key: cred.consumer_key,
        consumer_secret: cred.consumer_secret,
        token: cred.token,
        token_secret: cred.token_secret
    },
    returnPromises: true
});

var bar;

client.userLikes({ limit: 1 })
    .then(res => {
        var numLiked = res.liked_count;

        bar = new ProgressBar('[:bar] :percent :file', {
            total: numLiked,
            width: 20
        });

        download(numLiked, 0);
    })

    .catch(err => {
        console.error("Error: " + err);
    });

function download(numLiked, offset) {
    client.userLikes({ offset: offset })
        .then(res => {
            for (var i = 0; i < res.liked_posts.length; i++) {
                var post = res.liked_posts[i];

                if (post.type == 'photo') {
                    for (var j = 0; j < post.photos.length; j++) {
                        var url = post.photos[j].original_size.url;
                        var name = path.basename(url);
                        var fullpath = (argv.d || 'downloaded') + '/' + name;

                        fs.stat(fullpath, (err, stat) => {
                            if (err == null) {
                                bar.tick({
                                    'file': name + ' (file exists)'
                                });
                            } else if (err.code == 'ENOENT') {
                                request(url)
                                    .on('error', err => {
                                        console.error(err);
                                    })
                                    .on('close', () => {
                                        bar.tick({
                                            'file': name
                                        });
                                    })
                                    .pipe(fs.createWriteStream(fullpath));
                            }
                        });

                    }
                } else if (post.type == 'video') {
                    var url = post.video_url;
                    var name = path.basename(url);
                    var fullpath = (argv.d || 'downloaded') + '/' + name;

                    fs.stat(fullpath, (err, stat) => {
                        if (err == null) {
                            bar.tick({
                                'file': name + ' (file exists)'
                            });
                        } else if (err.code == 'ENOENT') {
                            request(url)
                                .on('error', err => {
                                    console.error(err);
                                })
                                .on('close', () => {
                                    bar.tick({
                                        'file': name
                                    });
                                })
                                .pipe(fs.createWriteStream(fullpath));
                        }
                    });
                }
            }

            offset += res.liked_posts.length;
            download(numLiked, offset);
        })

        .catch(err => {
            console.error("Error: " + err);
        });
}
