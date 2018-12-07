# tumblr-like-dl

Downloads your liked photos and videos on Tumblr.

## WARNING: No longer working
tumblr-like-dl is not working anymore. See my Rust project, [tumblr-likes](https://github.com/subnomo/tumblr-likes).

## Installation

```
$ npm install -g tumblr-like-dl
```


## Configuration

1. [Register an application with the Tumblr API](https://www.tumblr.com/oauth/apps). The name and other options don't matter.
2. Click "Expore API" under the application you just created
3. Click "Allow"
4. Create a `tumblr_credentials.json` in your home directory (copy the example from the repo) and fill it with the API keys in the Tumblr API console

Note: You can also create a environmental variable `$TUMBLR_CREDS` that points to the credentials json file.

## Usage

```
$ tumblrld [-d output_directory]
```
