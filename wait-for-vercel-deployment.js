const { appendFileSync } = require("fs");

const vercelApiToken = process.env.VERCEL_API_TOKEN;
const projectId = process.env.VERCEL_PROJECT_ID;
const branch = process.env.BRANCH_NAME;
const commitHash = process.env.COMMIT_HASH;
const githubEnvPath = process.env.GITHUB_ENV;

if (!vercelApiToken || !projectId || !branch || !commitHash) {
  throw Error('Missing required environment variables');
}

const waitForDeploymentState = async (projectId, branch, apiToken, expectedState) => {
  while (true) {
    const deploymentsResponse = await fetch(`https://api.vercel.com/v6/deployments?projectId=${projectId}&meta=githubCommitRef=${branch}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${vercelApiToken}`,
        'Content-Type': 'application/json',
      },
    });

    const deployments = await deploymentsResponse.json();
    const latestDeployment = deployments.deployments && deployments.deployments.find((deployment) => deployment.meta.githubCommitSha === commitHash);

    if (!latestDeployment) {
      console.log(`No deployment found for the commit ${commitHash}`);
      console.log('Polling again in 1 second');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      continue;
    }
    console.log(`Deployment state: ${latestDeployment.state}`);
    return latestDeployment;
  }
}

async function main() {
  const deployment = await waitForDeploymentState(projectId, branch, vercelApiToken, 'READY')
  console.log(`Latest Deployment ID: ${deployment.uid}`);
  appendFileSync(path, `BASE_URL=${deployment.uid}\n`);
}

main();
