import re

with open('src/pages/TenantResourceOverview.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the extra </div>
content = content.replace(
"""      </div>
      </div>
    </div>
  );
}""",
"""      </div>
    </div>
  );
}"""
)

with open('src/pages/TenantResourceOverview.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
