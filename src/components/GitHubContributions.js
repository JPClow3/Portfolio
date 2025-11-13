import React, {useState, useEffect} from 'react';

/**
 * GitHub Contributions Widget
 * Displays recent GitHub activity/contributions using GitHub API
 */
const GitHubContributions = ({username = 'JPClow3', limit = 5}) => {
    const [contributions, setContributions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch GitHub contributions
        const fetchContributions = async () => {
            try {
                // Use GitHub GraphQL API for contributions (simplified approach)
                // Note: For full contribution graph, you'd need to use GitHub's contributions API
                // This is a simplified version that shows recent repository activity
                const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=${limit}`, {
                    headers: {
                        'Accept': 'application/vnd.github.v3+json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch GitHub data');
                }

                const repos = await response.json();
                setContributions(repos);
                setLoading(false);
            } catch (err) {
                console.warn('Failed to fetch GitHub contributions:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchContributions();
    }, [username, limit]);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error || !contributions || contributions.length === 0) {
        return null; // Don't show anything if there's an error
    }

    return (
        <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:via-purple-900/20 dark:to-blue-900/30 rounded-xl border-2 border-blue-200 dark:border-indigo-700">
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-cyan-400 dark:to-purple-400 bg-clip-text text-transparent">
                Recent Activity
            </h3>
            <div className="space-y-3">
                {contributions.slice(0, limit).map((repo) => (
                    <a
                        key={repo.id}
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-3 rounded-lg bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 transition-all duration-300 hover:shadow-md group"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-slate-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors truncate">
                                    {repo.name}
                                </h4>
                                {repo.description && (
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                                        {repo.description}
                                    </p>
                                )}
                                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 dark:text-slate-500">
                                    {repo.language && (
                                        <span className="flex items-center gap-1">
                                            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                                            {repo.language}
                                        </span>
                                    )}
                                    <span>⭐ {repo.stargazers_count || 0}</span>
                                    <span>📅 {new Date(repo.updated_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <svg
                                className="flex-shrink-0 w-5 h-5 text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 group-hover:translate-x-1 transition-all duration-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </a>
                ))}
            </div>
            <a
                href={`https://github.com/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
            >
                View on GitHub
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </a>
        </div>
    );
};

export default GitHubContributions;

