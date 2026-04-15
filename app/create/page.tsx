export default function CreateCampaignPage() {
    return (
      <main className="bg-[#F7F3EC] min-h-screen py-14 pt-28 px-4">
        <section className="max-w-xl mx-auto">
          <header className="text-center mb-8">
            <h1 className="text-5xl font-serif font-bold text-[#9A432E]">
              Launch a Story
            </h1>
            <p className="mt-3 text-sm text-stone-600">
              Create a campaign that bridges the gap between community needs and global support.
            </p>
          </header>
  
          <form className="space-y-5">
            {/* Campaign Identity */}
            <div className="rounded-2xl bg-[#F2EEE7] p-5">
              <h2 className="text-base font-semibold text-[#245B5B] mb-4">
                Campaign Identity
              </h2>
  
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wide text-stone-500 mb-1">
                    Campaign Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Classroom Supplies for Gorkha"
                    className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2D7774]"
                  />
                </div>
  
                <div>
                  <label className="block text-[11px] uppercase tracking-wide text-stone-500 mb-1">
                    Focus Area
                  </label>
                  <select className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2D7774]">
                    <option>Education</option>
                    <option>Emergency</option>
                    <option>Nutrition</option>
                    <option>Health</option>
                    <option>Environment</option>
                  </select>
                </div>
  
                <div>
                  <label className="block text-[11px] uppercase tracking-wide text-stone-500 mb-1">
                    The Story
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Explain the impact of this campaign in 2-3 sentences. Focus on the ‘why’..."
                    className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2D7774]"
                  />
                </div>
              </div>
            </div>
  
            {/* Visuals & Goal */}
            <div className="rounded-2xl bg-[#F2EEE7] p-5">
              <h2 className="text-base font-semibold text-[#245B5B] mb-4">
                Visuals & Goal
              </h2>
  
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wide text-stone-500 mb-1">
                    Featured Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2D7774]"
                  />
                </div>
  
                <div>
                  <label className="block text-[11px] uppercase tracking-wide text-stone-500 mb-1">
                    Goal Amount (USD)
                  </label>
                  <input
                    type="number"
                    min={1}
                    placeholder="5000"
                    className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2D7774]"
                  />
                </div>
              </div>
            </div>
  
            {/* CTA */}
            <button
              type="submit"
              className="w-full rounded-xl bg-[#2D7774] text-white font-semibold py-3 hover:bg-[#245f5d] transition"
            >
              Create Campaign
            </button>
          </form>
        </section>
      </main>
    );
  }