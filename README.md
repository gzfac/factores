# factores
Welcome to **factores**, an **open source** music bot that scopes to work with **official api's** from <a href="www.youtube.com" target="_blank">Youtube</a>, or <a href="www.spotify.com" target="_blank">Spotify</a>,<br>
and build a community around it, to encourage **junior .js** programmers to dive into the code, and test with it.<br><br>
We're working on a Discord server to bring **full time suport service**.<br><br>
We also accept suggests in order add **new functionalities**, or **improve** the current ones.
<br><br>
The bot is currently being hosted on a personal vps.<br><br>
- **Click** <a href="https://discord.com/api/oauth2/authorize?client_id=930458539636453417&permissions=8&scope=bot" target="_blank">**here**</a> to invite **factores** to your server.
<br><br>

## ubuntu - setup vscode
All tutorials were tested on both Ubuntu 20.04 and 18.04 system versions.

Pre-requisites:
<ul>
<li>
<a href="https://linuxize.com/post/how-to-install-visual-studio-code-on-ubuntu-20-04/" target="_blank">vscode</a> 
</li>
<li>
<a href="https://linuxize.com/post/how-to-install-node-js-on-ubuntu-18.04/" target="_blank">npm & node</a>
</li>
<li>
<a href="https://linuxize.com/post/how-to-install-ffmpeg-on-ubuntu-20-04/" target="_blank">FFmpeg</a>
</li>
</ul>
<h3>Installation</h3>
Once you installed them all, you can proceed openning vscode from a terminal:<br>

```
code "target_container_directory"
```

Then, open your terminal on vscode with `CTRL + '` and execute the following command:

```
npm install discord.js ffmpeg fluent-ffmpeg @discordjs/opus ytdl-core --save
```
## clone from this repository

### setup

First, install git:

```
sudo apt install git
```

Check the git version that's installed:

```
git --version
```

Set your GitHub username and email:

```
git config --global user.name "username"
git config --global user.email "your@email.com"
```
### how to clone

Generate your own key:

```
ssh-keygen
```

Type a name for your file:

```
Example output (in this case is public_github_key):

Generating public/private rsa key pair.
Enter file in which to save the key (/home/user/.ssh/id_rsa): public_github_key
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in public_github_key
Your public key has been saved in public_github_key.pub
The key fingerprint is:
SHA256... user@hostname
The key's randomart image is...

```

Then output the file content in order to copy your ssh key:

```
cat "path_to_your_file".pub
cat ~/.ssh/public_github_key
```

```
Example output:

ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCyPBe2gYuGQ9OfyrwMbedkpAwKG86NTibbIWdjB3zfMhdwtlM5ZkzHJPfeW+Xx6ykOBuRkacfWRPREeKAk/auiogJW3MtLq78 <br>/XsuCjjERFmy3OtCzLk4vfBRYSJw1lIXcgqLBus9cWv/bO8ISrDnh3EXU1/42sI6IIToGa0KsIaxP4W7tcgORl3Y36Qh<br>/JOdTigYekvVd/wPjjFveK9P2B4qU12ofrLVc+c1tyOszhMfZmUzLemDBnOX6JWPVTQINP/1VXTYwm5ZF5+/K4olgDZ<br>/JOreczcPoJJ0R1zrRrBBjM7GsRuIN2YdysXeQsjrcqpwjdlbU2LHmgNNghTe9l3syPfGWqOqz3zuijOf0UOEx2Arnf7MNBXYAodz0Ru5k6CA9WKDrb71q0PsVVBcbxRPgfkjsK48thX9+eNwDhf8bZo+xd9/OkO9lpiQDgieqvXdIApMT/fUt9sJNHDA1O1OfuWhwQBpmnDlNIvTBowmFTA5P7MG9tUtOBW7lE= user@hostname
```

### up to GitHub

<i>Disclaimer: this works only for contributors of this repository</i>

- Copy the content as it's displayed, and login to your [**GitHub**](https://github.com/) account. <br>
- Then, go to upper panel, click on your profile picture, and go to **Your repositories**
- Select [**factores**](https://github.com/gzfac/factores) repository
- Go to **settings**
- In the sidebar, click on **Deploy Keys**
- Write a title, and copy your key in the **text box**
- Check **Allow write access**, and **Add key**<br><br>

## clone from terminal

Once you've linked your **ssh-key** to this repository, execute the following on a **terminal**:

```
git clone git@github.com:gzfac/factores.git /wanted/repository/location
```

Then, you may open this folder on **vscode**:

- If you're already on vs, you can **open folder** with `CTRL+P`
- If not, open a **terminal**, and run `code "/wanted/repository/location"`

## running factores

To run the bot on localhost, you first have to **create your own app**, in the [**Discord Dev. Portal**](https://discord.com/developers/applications), and
setup your bot there ([see how](https://discordpy.readthedocs.io/en/stable/discord.html))

### get token and config.json

In order to be able to run the bot, node needs a file called "config.json", create it from **vscode** terminal with:

```
sudo touch config.json
```

This file, **sould** look like this, replacing **"your-token"** with the token provided by Discord:

```
{

  "prefix": "!"
  "token": "your-token"

}
```
