import { motion } from "framer-motion";

function Block({ label, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="py-8 border-t"
      style={{ borderColor: "var(--border)" }}
    >
      <p className="text-xs uppercase tracking-[0.15em] mb-3" style={{ color: "var(--text-secondary)" }}>
        {label}
      </p>
      <div className="leading-relaxed" style={{ color: "var(--text-primary)" }}>{children}</div>
    </motion.div>
  );
}

function ListBlock({ label, items, delay = 0 }) {
  return (
    <Block label={label} delay={delay}>
      <ul className="space-y-2.5">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3">
            <span className="mt-2 h-1 w-1 rounded-full shrink-0" style={{ background: "var(--accent)" }} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </Block>
  );
}

function ResultsBlock({ results, delay = 0 }) {
  const isStructured = results.length > 0 && typeof results[0] === "object";

  return (
    <Block label="Results" delay={delay}>
      {isStructured ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {results.map((r, i) => (
            <div key={i} className="rounded-lg p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <p className="text-xs uppercase tracking-wide mb-1" style={{ color: "var(--text-secondary)" }}>
                {r.metric}
              </p>
              <p className="text-2xl font-brand mb-1" style={{ color: "var(--accent)" }}>
                {r.value}
              </p>
              {r.context && (
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {r.context}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <ul className="space-y-2.5">
          {results.map((item, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-2 h-1 w-1 rounded-full shrink-0" style={{ background: "var(--accent)" }} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </Block>
  );
}

function Analysis({ result, onReset }) {
  const hasMetadata = (result.authors && result.authors.length > 0) || result.year;

  return (
    <div>
      <button onClick={onReset} className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
        ← Analyze another paper
      </button>

      <p className="text-xs uppercase tracking-[0.15em] mb-2" style={{ color: "var(--text-secondary)" }}>
        Paper
      </p>
      <h1 className="font-brand text-3xl leading-tight mb-2">{result.title}</h1>

      {hasMetadata && (
        <p className="text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
          {result.authors && result.authors.length > 0 && result.authors.join(", ")}
          {result.authors && result.authors.length > 0 && result.year && " · "}
          {result.year}
        </p>
      )}

      <Block label="Summary" delay={0}>{result.summary}</Block>
      <Block label="The problem" delay={0.05}>{result.problem}</Block>
      <ListBlock label="Methodology" items={result.methodology} delay={0.1} />
      <Block label="Dataset" delay={0.15}>{result.dataset}</Block>
      <ResultsBlock results={result.results} delay={0.2} />
      <ListBlock label="Limitations" items={result.limitations} delay={0.25} />
      <ListBlock label="What you should know" items={result.prerequisites} delay={0.3} />
      <ListBlock label="Test your understanding" items={result.questions} delay={0.35} />

      {result.retrieved_knowledge && result.retrieved_knowledge.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="py-8 border-t"
          style={{ borderColor: "var(--border)" }}
        >
          <p className="text-xs uppercase tracking-[0.15em] mb-1" style={{ color: "var(--text-secondary)" }}>
            Retrieved knowledge
          </p>
          <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
            Pramana retrieves relevant knowledge to support this explanation.
          </p>
          <div className="grid gap-3">
            {result.retrieved_knowledge.map((chunk, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.45 + i * 0.1 }}
                className="rounded-lg p-4 text-sm leading-relaxed"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                {chunk}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default Analysis;