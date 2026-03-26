import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const ORG = "vidhwaan";

/* CREATE REPO */
app.post("/create-repo", async (req,res)=>{

const { phone } = req.body;

const gh = await fetch(`https://api.github.com/orgs/${ORG}/repos`,{
method:"POST",
headers:{
"Authorization":`Bearer ${GITHUB_TOKEN}`,
"Accept":"application/vnd.github+json"
},
body:JSON.stringify({
name:phone,
private:false,
auto_init:true
})
});

const data = await gh.json();

res.json(data);

});


/* PUSH FILE */
app.post("/push-file", async (req,res)=>{

const { repo, path, content } = req.body;

const gh = await fetch(`https://api.github.com/repos/${ORG}/${repo}/contents/${path}`,{
method:"PUT",
headers:{
"Authorization":`Bearer ${GITHUB_TOKEN}`,
"Accept":"application/vnd.github+json"
},
body:JSON.stringify({
message:"update",
content
})
});

const data = await gh.json();

res.json(data);

});

app.listen(3000);
